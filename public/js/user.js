$(function() {
	$.ajax({
		url: 'http://localhost:3000/admin/user',
		type: 'get',
		dataType: 'json',
		data:'',
		success: function(result) {       
	        var censusdata = result.census;
	        var myChart = echarts.init(document.getElementById('census'));
	        var option = {
                backgroundColor: '#F5F5F5',
	            title: {
	                text: 'ECloud Users Census Distribution',
                    x: 'center',
	                subtext: `Part of users' portraits`,
	                link: 'http://localhost:3000/index.html'
	            },
	            tooltip: {
                    //show: false //不显示提示标签
	                formatter: '{b}<br/>{c} (人)', //提示标签格式
	                backgroundColor:"#ff7f50",//提示标签背景颜色
	                textStyle:{color:"#fff"} //提示标签字体颜色
	            },
	            toolbox: {
	                show: true,
	                orient: 'vertical',
	                left: 'right',
	                top: 'center',
	                feature: {
	                    dataView: {readOnly: false},
	                    restore: {},
	                    saveAsImage: {}
	                }
	            },
	            visualMap: {
	                min: 0,
	                max: 10,
	                text:['High','Low'],
	                realtime: true,
	                calculable: true,
	                inRange: {
	                    color: ['lightskyblue','yellow', 'orangered']
	                }
	            },
	            series: [{
	                type: 'map',
	                mapType: 'china',
	                label: {
	                    normal: {
	                        show: true,//显示省份标签
	                        textStyle:{color:"#c71585"}//省份标签字体颜色
	                    },    
	                    emphasis: {//对应的鼠标悬浮效果
	                        show: true,
	                        textStyle:{color:"#800080"}
	                    } 
	                },
	                itemStyle: {
	                    normal: {
	                        borderWidth: .5,//区域边框宽度
	                        borderColor: '#009fe8',//区域边框颜色
	                        areaColor:"#ffefd5",//区域颜色
	                    },
	                    emphasis: {
	                        borderWidth: .5,
	                        borderColor: '#4b0082',
	                        areaColor:"#ffdead",
	                    }
	                },
	                data: censusdata
	            }],
	        };
	        myChart.setOption(option);
        	var myChart = echarts.init(document.getElementById('sex'));
        	var sexdata = result.sex;
          	// 指定图表的配置项和数据
            myChart.setOption({
                backgroundColor: '#FFFAF0',
                title: {
                    text: 'M&&W',
                    subtext: 'Male to Female ratio',
                    x: 'center'
                },
                tooltip: {
                	formatter: '{b}<br/>{c} (人)', //提示标签格式
        	        backgroundColor:"#ff7f50",//提示标签背景颜色
        	        textStyle:{color:"#fff"} //提示标签字体颜色
                },
                legend: {
                    data: ['M/W User numbers ']
                },
                xAxis: {
                    data: ['Male', 'Female']
                },
                yAxis: {},
                series: [{
                    name: 'count',
                    type: 'bar',
                    data: sexdata
                }]
        	});
        	var myChart = echarts.init(document.getElementById('age'));
        	var dataAxis = result.x_data;
        	var data = result.y_data;
        	var yMax = 10;
        	var dataShadow = [];

        	for (var i = 0; i < data.length; i++) {
        	    dataShadow.push(yMax);
        	}

        	option = {
                backgroundColor: '#FFFAFA',
        	    title: {
        	        text: 'Age Distribution',
        	        subtext: 'Age distribution',
                    x: 'center'
        	    },
        	    xAxis: {
        	        data: dataAxis,
        	        axisLabel: {
        	            inside: true,
        	            textStyle: {
        	                color: '#fff'
        	            }
        	        },
        	        axisTick: {
        	            show: false
        	        },
        	        axisLine: {
        	            show: false
        	        },
        	        z: 10
        	    },
        	    yAxis: {
        	        axisLine: {
        	            show: false
        	        },
        	        axisTick: {
        	            show: false
        	        },
        	        axisLabel: {
        	            textStyle: {
        	                color: '#999'
        	            }
        	        }
        	    },
        	    dataZoom: [
        	        {
        	            type: 'inside'
        	        }
        	    ],
        	    series: [
        	        { // For shadow
        	            type: 'bar',
        	            itemStyle: {
        	                normal: {color: 'rgba(0,0,0,0.05)'}
        	            },
        	            barGap:'-100%',
        	            barCategoryGap:'40%',
        	            data: dataShadow,
        	            animation: false
        	        },
        	        {
        	            type: 'bar',
        	            itemStyle: {
        	                normal: {
        	                    color: new echarts.graphic.LinearGradient(
        	                        0, 0, 0, 1,
        	                        [
        	                            {offset: 0, color: '#83bff6'},
        	                            {offset: 0.5, color: '#188df0'},
        	                            {offset: 1, color: '#188df0'}
        	                        ]
        	                    )
        	                },
        	                emphasis: {
        	                    color: new echarts.graphic.LinearGradient(
        	                        0, 0, 0, 1,
        	                        [
        	                            {offset: 0, color: '#2378f7'},
        	                            {offset: 0.7, color: '#2378f7'},
        	                            {offset: 1, color: '#83bff6'}
        	                        ]
        	                    )
        	                }
        	            },
        	            data: data
        	        }
        	    ]
        	};
        	myChart.setOption(option);
        	// Enable data zoom when user click bar.
        	var zoomSize = 6;
        	myChart.on('click', function (params) {
        	    myChart.dispatchAction({
        	        type: 'dataZoom',
        	        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
        	        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        	    });
        	});
		}

	})

});
