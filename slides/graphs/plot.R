library("ggplot2")
library("rjson")
library("reshape")
library("scales")
## library("extrafont")
## font_import()

pldi_colors <-
  c("#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#ff99ff",
    "#660066", "#695629", "#403d35", "#7bab9b", "#6e7050", "#afcbf5", "#12233d",
    "#4f6748", "#97b48f", "#acacc0", "#81675a", "#67564d", "#20341a")

bar_plot<- function(data, no_of_cols, ylabel, xlabel, colors, legend) {
  ## data$Div1 <- factor(data$Div1)
  
  plot <- ggplot(data, aes(x=xcol, y=ycol, fill=fcol)) + geom_bar(stat="identity")

  if ("error" %in% colnames(data)) {
    plot <- plot + geom_errorbar(aes(ymin=ycol-error, ymax=ycol+error), width=.25)
  }

  plot <- plot + scale_fill_manual(values = colors )
  
  plot <- plot + ylab(ylabel) + xlab(xlabel)
  
  plot <- plot + theme_bw()
  
  plot <- plot + opts(axis.title.x= theme_text( size=18 ))
  plot <- plot + opts(axis.title.y= theme_text( size=18, angle=90))
  
  plot <- plot + opts(axis.text.x= theme_text( angle=55, hjust=1, vjust=1, size=12 ))
  ## plot <- plot + opts(axis.text.x= theme_text( hjust=1, vjust=1, size=12 ))
  plot <- plot + opts(axis.text.y= theme_text( size=12, hjust=1))
  
  plot <- plot + opts(strip.text.x = theme_text(size=14))
  plot <- plot + opts(strip.text.y = theme_text(size=14, angle=-90))

  if (!legend) {
    plot <- plot + opts(legend.position="none")
  } else {
    plot <- plot + opts(legend.title=theme_blank())
  }

  return(plot)
}

##### Parse Times #####

read_parsemark <- function(filename) {
  return(cast(melt(fromJSON(paste(readLines(filename), collapse=""))), L1 ~ ...))
}

baseline <- read_parsemark("baseline_2012-08-29.json")

processed <- read_parsemark("processed.json")

matches <- match(processed$L1, baseline$L1)

combined_err <- qt(0.975, df=49)*(processed$stddev_ms+baseline[matches, 'stddev_ms'])/sqrt(50)/baseline[matches, 'average_ms']

percent_difference <- (baseline[matches, 'average_ms'] - processed$average_ms)/baseline[matches, 'average_ms']

parse_times <- data.frame(xcol=processed$L1, ycol=percent_difference, fcol=processed$L1, error=combined_err)

parse_time_plot <- bar_plot( parse_times, 1, "Parse Time Speedup", "", pldi_colors, FALSE)
parse_time_plot <- parse_time_plot + geom_hline(aes(yintercept=mean(percent_difference)))
parse_time_plot <- parse_time_plot + scale_y_continuous(labels = percent)

ggsave("parse_times.pdf", height=5, width=5)
ggsave("parse_times.png", height=4, width=4, dpi=300)
## ggsave("parse_times.svg")


##### Unused Functions #####

function_percentage <- read.csv("percent_used.csv", header=TRUE)
function_percentage <- rbind(
                         data.frame(site=function_percentage$site, percent=function_percentage$percent_used, used="Called"),
                         data.frame(site=function_percentage$site, percent=1-function_percentage$percent_used, used="Not Called")
                         )

function_percentage_data <- data.frame(xcol=function_percentage$site, ycol=function_percentage$percent, fcol=function_percentage$used)

function_usage_plot = bar_plot(function_percentage_data, 1, "Functions", "", c("#1f78b4", "#a6cee3"), TRUE)
function_usage_plot <- function_usage_plot + coord_flip()
function_usage_plot <- function_usage_plot + scale_y_continuous(labels = percent)

ggsave("function_usage.pdf", height=3, width=5)
ggsave("function_usage.png", height=3, width=5, dpi=300)


##### BananaBread #####

bb <- read.csv("bb.csv", header=TRUE)
runs <- 20
bb$err <- qt(0.975, df=runs-1)*(bb$stddev/1000)/sqrt(runs)
bb_data <- data.frame(xcol=bb$variant, ycol=bb$time/1000, fcol=bb$variant, error=bb$err)

bb_plot <- bar_plot(bb_data, 1, "Load Time (s)", "", pldi_colors, FALSE)
bb_plot <- bb_plot + coord_cartesian(ylim = c(5,6.5))
ggsave("bb.pdf", height=4, width=5)
ggsave("bb.png", height=4, width=5, dpi=300)

bb_colors <-
  c("#bdc9e1", "#74a9cf", "#0570b0", "#FDCC8A", "#FC8D59", "#E34A33", "#B30000")


bb <- read.csv("bb_delayed.csv", header=TRUE)
runs <- 20
bb$err <- qt(0.975, df=runs-1)*(bb$stddev/1000)/sqrt(runs)
bb_data <- data.frame(xcol=reorder(bb$variant, seq.int(length.out=length(bb$variant))), ycol=bb$time/1000, fcol=reorder(bb$variant, seq.int(length.out=length(bb$variant))), error=bb$err)

bb_plot <- bar_plot(bb_data, 1, "Load Time (s)", "", bb_colors, FALSE)
bb_plot <- bb_plot + coord_cartesian(ylim = c(10,30))
ggsave("bb_delayed.pdf", height=4, width=5)
ggsave("bb_delayed.png", height=4, width=5, dpi=300)

bb_colors <-
  c("#F1EEF6", "#F1EEF6", "#0570b0", "#FEF0D9", "#FEF0D9", "#FEF0D9", "#B30000")


bb <- read.csv("bb_delayed.csv", header=TRUE)
runs <- 20
bb$err <- qt(0.975, df=runs-1)*(bb$stddev/1000)/sqrt(runs)
bb_data <- data.frame(xcol=reorder(bb$variant, seq.int(length.out=length(bb$variant))), ycol=bb$time/1000, fcol=reorder(bb$variant, seq.int(length.out=length(bb$variant))), error=bb$err)

bb_plot <- bar_plot(bb_data, 1, "Load Time (s)", "", bb_colors, FALSE)
bb_plot <- bb_plot + coord_cartesian(ylim = c(10,30))
ggsave("bb_delayed_greyed.pdf", height=4, width=5)
ggsave("bb_delayed_greyed.png", height=4, width=5, dpi=300)
