// 基于准备好的dom，初始化echarts实例
const myChart = echarts.init(document.getElementById('main'));

const m2 = {};

const generateM2 = data => {
  
  m2.legend = [data.F2, data.G2]
  m2.xAxis = [data.E3, data.E4]
  m2.series = [
    {
      name: data.F2,
      type:'bar',
      label: {
          normal: {
              show: true,
              position: 'inside'
          }
      },
      data:[data.F3, data.F4]
    },
    {
        name: data.G2,
        type:'bar',
        label: {
            normal: {
                show: true
            }
        },
        data:[data.G3, data.G4]
    },
  ]
}

$.get('http://127.0.0.1:8089/data/excel.json', (data) => {
  console.log(data.G3)
  generateM2(data);

  const option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: m2.legend
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    
    xAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : m2.xAxis
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : m2.series
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
})


