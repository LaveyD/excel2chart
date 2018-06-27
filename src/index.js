// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

var chartData = window.__INIT_DATA__;
// 指定图表的配置项和数据
var option = {
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
        data: chartData.legend
    },
    xAxis: {
        data: chartData.xAxis,
        axisLabel: {
            textStyle: {
                fontSize: 18
            }
        }
    },
    yAxis: {
        axisLabel: {
            textStyle: {
                fontSize: 18
            }
        }
    },
    series: [{
        name: '销量',
        type: 'bar',
        data: chartData.series
    }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);