library("ggplot2")
library("rjson")
library("reshape")
library("extrafont")
font_import()

pldi_colors <- function() {
  return(c("#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#ff99ff",
           "#660066", "#695629", "#403d35", "#7bab9b", "#6e7050", "#afcbf5", "#12233d",
           "#4f6748", "#97b48f", "#acacc0", "#81675a", "#67564d", "#20341a"))
}

single_combined_plot <- function(data, no_of_cols, ylabel, xlabel) {
  ## data$Div1 <- factor(data$Div1)
  
  plot <- ggplot(data, aes(x=names, y=averages, fill=names)) + geom_bar(stat="identity")
  
  plot <- plot + geom_errorbar(aes(ymin=averages-error, ymax=averages+error), width=.25)
  
  plot <- plot + scale_fill_manual(values = pldi_colors() )
  
  plot <- plot + ylab(ylabel) + xlab(xlabel)
  
  plot <- plot + theme_bw()
  
  plot <- plot + opts(axis.title.x= theme_text( size=18 ))
  plot <- plot + opts(axis.title.y= theme_text( size=18, angle=90))
  
  plot <- plot + opts(axis.text.x= theme_text( angle=55, hjust=1, vjust=1, size=12 ))
  ## plot <- plot + opts(axis.text.x= theme_text( hjust=1, vjust=1, size=12 ))
  plot <- plot + opts(axis.text.y= theme_text( size=12, hjust=1))
  
  plot <- plot + opts(strip.text.x = theme_text(size=14))
  plot <- plot + opts(strip.text.y = theme_text(size=14, angle=-90))
  plot <- plot + opts(legend.position="none")
  return(plot)
}

read_parsemark <- function(filename) {
  return(cast(melt(fromJSON(paste(readLines(filename), collapse=""))), L1 ~ ...))
}

baseline <- read_parsemark("baseline_2012-08-29.json")

processed <- read_parsemark("processed.json")

matches <- match(processed$L1, baseline$L1)

combined_err <- qt(0.975, df=49)*(processed$stddev_ms+baseline[matches, 'stddev_ms'])/sqrt(50)/baseline[matches, 'average_ms']

percent_difference <- (processed$average_ms - baseline[matches, 'average_ms'])/baseline[matches, 'average_ms']

data <- data.frame(names=processed$L1, averages=percent_difference, error=combined_err)

single_combined_plot( data, 1, "% Difference in parse time", "")
ggsave("parse_times.pdf", height=5, width=5)
ggsave("parse_times.png", height=5, width=5)
ggsave("parse_times.svg")
