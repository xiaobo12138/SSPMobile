//10位时间戳转成时间
function get_Date(tm){
	//只有个位的补齐，如：01-02
	var ultZeroize = function ultZeroize(v, l) {
        var z = "";
        l = l || 2;
        v = String(v);
        for (var i = 0; i < l - v.length; i++) {
            z += "0";
        }
        return z + v;
   };
     //获取10位时间戳，并乘以1000
     var d = new Date(tm * 1000);    //根据时间戳生成的时间对象 
     var date = (d.getFullYear()) + "-" +  
           ultZeroize(d.getMonth() + 1) + "-" + 
           ultZeroize(d.getDate())+ " " +
           ultZeroize(d.getHours()) + ":" + 
           ultZeroize(d.getMinutes()) + ":" + 
           ultZeroize(d.getSeconds())
           ;
         return date; 
} 
function workflowCodeType(value) {
	switch (value) {
	    case '出差申请': value = 'Electron_Evection_Airplane'; break;
	    case '招待申请': value = 'EntertainDinnerApplication'; break;
	    case '差旅费报销': value = 'TravwlingReimburse'; break;
	    case '通讯费报销': value = 'CommunicationExpense'; break;
	    case '招待费报销': value = 'EntertainDinnerExpense'; break;
	    case '会议费报销': value = 'MeetingExpense'; break;
	    case '会议费申请': value = 'MeetingApplycation'; break;
	    case '其他费报销': value = 'Electron_Traffic_Reimburse'; break;
	    case '工作餐报销': value = 'WorkingLunchExpense'; break;
	    case '交通费报销': value = 'Electron_Traffic_Reimburse'; break;
	    case '加油费报销': value = 'CarFillUpExpense'; break;
	}
	return value;
}
function feeType(value) {
	switch (value) {
		case '1': value = '交通费'; break;
	    case '2': value = '停车费'; break;
	    case '3': value = '过路费'; break;
	    case '4': value = '租车费'; break;
	    case '6': value = '快递费'; break;
	    case '7': value = '打印费'; break;
	    case '8': value = '图书费'; break;
	}
	return value;
}

//计算两个时间的时间差
function getTimeCha(startTime, endTime) {//string类型2015-9-8
	var v = new Date();//定义两个属性代表时间
    var e = new Date();
	var getDateCha = function(beginDate, endDate) {//date类型
	var res = {
	D: 0,
	H: 0,
	M: 0,
	S: 0,
	abs: true,
	error: false
	};
	//属性形式验证：第一次参数必须是Date类型，第二个参数可以为空，默认为new Date()
	if(typeof(endDate) == "undefined" || null == endDate || "" == endDate) {
	endDate = new Date();
	}
	if(!(beginDate instanceof(Date)) || !(endDate instanceof(Date))) {
	res.error = true; //"非法时间字符串";
	return res;
	}
	 
	//比较大小，保证差值一定是正数。
	if(beginDate > endDate) {
	var tempDate = beginDate;
	beginDate = endDate;
	endDate = tempDate;
	res.abs = false; //表示beginDate大于endDate
	}
	var chaTime = (endDate.getTime() - beginDate.getTime());
	 
	var Day_Param = 1000 * 60 * 60 * 24; //一天等于毫秒数
	var Hour_Param = 1000 * 60 * 60; //一小时等于毫秒数
	res.D = Math.floor(chaTime / (Day_Param)); //
	 
	chaTime = chaTime - res.D * Day_Param; //减去天的毫秒数。再求小时个数
	res.H = Math.floor(chaTime / (Hour_Param));
	chaTime = chaTime - res.H * Hour_Param; //减去小时的毫秒数。再求分钟个数
	res.M = Math.floor(chaTime / (1000 * 60));
	res.S = (chaTime - res.M * 1000 * 60) / 1000; //减去分钟的毫秒数。再求秒的个数
	//alert(res.S);
	 
	res.toString = function() {
	return this.D;
	//           + "日" + this.H + "小时" + this.M + "分钟"
	};
	return res;
	 
	}
	
	var times1 = startTime.split('-');
	v.setFullYear(times1[0]);
	v.setMonth(times1[1] - 1);
	v.setDate(times1[2]);
	 
	var times2 = endTime.split('-');
	e.setFullYear(times2[0]);
	e.setMonth(times2[1] - 1);
	e.setDate(times2[2]);
	 
	var ressult = getDateCha(v, e).toString();// getDateCha(v, e)方法调用
	return ressult;
}

//数字转换为金额格式（字符串）
function formatCurrency(num) {
	if(num == null){
		return;
	}
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))    
    num = "0";    
    sign = (num == (num = Math.abs(num)));    
    num = Math.floor(num*100+0.50000000001);    
    cents = num%100;    
    num = Math.floor(num/100).toString();    
    if(cents<10)    
    cents = "0" + cents;    
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)    
    num = num.substring(0,num.length-(4*i+3))+','+    
    num.substring(num.length-(4*i+3));    
    return (((sign)?'':'-') + num + '.' + cents);
}  


//获取列表
function showList(token){
	//待办
	var req = "";
	var myurl = get_Url() + '/iServer/gtasks/moveList';
	var myData = {
		"loginUserCode": useruuid
	}
	$.ajax({
		type:"get",
		url:myurl,
		data:myData,
		beforeSend: function() {
	       mui('#loadingPopover').popover('show');
	    },
	    complete: function() {
	       mui('#loadingPopover').popover('hide');
	    },
		success: function(data) {
			//把json串转化为Json对象
			var jsonData = JSON.parse(data);
			dataList.splice(0, dataList.length); //清空数组
			dataList = jsonData.rows;
			var count = dataList.length;
			console.log(count);
			if(count<=0){
				mui.alert("暂无待办数据", ' ', function() {
				
				});
			}else{
			//展示列表数据 
			for(var i = 0; i < count; i++) {
				console.log(dataList[i].workflowCode);
				req += '<li name="待办" class="mui-table-view-cell todoList-todoCell" id="' + i + '" >';

				req += '<img class="mui-media-object mui-pull-left list-headImg" src="images/head2.png">';
				req += '<div class="mui-media-body">';
				req += '<a href="javascript:;" style="color:#1b82d2;">';
				req += '<span class="list-name">' + dataList[i].userName + '</span> ';
				req += '</a>';
				
				var type = dataList[i].instanceName;
				if(type == '交通费报销') {
					req += '<span class="list-chai" style="vertical-align: top;">交</span>';
				} else if(type == '差旅费报销' || type == '出差申请') {
					req += '<span class="list-chai" style="vertical-align: top;">差</span>';
				} else if(type == '通讯费报销') {
					req += '<span class="list-chai" style="vertical-align: top;">通</span>';
				} else if(type == '招待费报销' || type == '招待申请'){
					req += '<span class="list-chai" style="vertical-align: top;">待</span>';
				}else if(type == '会议费报销' || type == '会议费申请'){
					req += '<span class="list-chai" style="vertical-align: top;">会</span>';
				}else if(type == '加油费报销'){
					req += '<span class="list-chai" style="vertical-align: top;">油</span>';
				}else if(type == '其他费报销'){
					req += '<span class="list-chai" style="vertical-align: top;">其</span>';
				}else {
					req += '<span class="list-chai" style="vertical-align: top;">餐</span>';
				}
				req += '<span class="todoList-instanceName">' + dataList[i].instanceName + ':</span>';	
				
				if(type == '出差申请') {
					req += '<span class="todoList-totalFee">' + dataList[i].travelPlace + '</span>';
				}else if(type == '招待申请' || type == '会议费申请') {
					var expectedCost = formatCurrency(dataList[i].expectedCost);
					req += '<span class="todoList-totalFee" >￥' + expectedCost + '</span>';
				}else{
					var totalFee = formatCurrency(dataList[i].totalFee);
					req	 += '<span class="todoList-totalFee" >￥' + totalFee + '</span>';
				}
				//超限
                if(dataList[i].isOverProof=='1'){
					req +='<img src="images/surpass.png" style="margin-left: 5px;width: 33px;height: 15px;"/>';
				}
				req += '<img src="images/right.png" class="mui-pull-right list-rightImg"/>';
				if(type == '招待申请' || type == '会议费申请'){
					req += '<p class="list-content">' + dataList[i].receptionProject + '</p>';
				}else if(dataList[i].travelReason == null){
					req += '<p class="list-content"></p>';
				}else{
					req += '<p class="list-content">' + dataList[i].travelReason + '</p>';
				}
				
				var timeStr = get_Date((dataList[i].createdTime / 1000));
				//截取字符串，显示月日时分
				var time = timeStr.substring(5, 16);
				req += '<span class="mui-pull-right list-time">' + time + '</span>';
				req += '</div>';
				req += '<div style="height: 0.5px;background: #eeeeee;margin-top: 10px;">';
				req += '</div>';
				req += '</li>';
				req += '<li class="mui-table-view-cell mui-media todoList-buttonView">';
				req += '<img src="images/menu.png" class="list-menu"/>';
				if(dataList[i].activityCode!="Activity8" && dataList[i].activityCode!="Activity9" && dataList[i].activityCode!="Activity11" && dataList[i].activityCode!="Activity56"){//管理员不能审批
					req += '<button class="mui-pull-right list-agreeBtn" onclick="noApprove()">同意</button>';
					req += '<button class="mui-pull-right list-disagreeBtn" onclick="noApprove()">不同意</button>';
				}else{
					req += '<button class="mui-pull-right list-agreeBtn" onclick="agree(this.value)" value="' + i +'">同意</button>';
					req += '<button class="mui-pull-right list-disagreeBtn" onclick="disAgree(this.value)" value="' + i +'">不同意</button>';
				}
				req += '</li>';

			}
			document.getElementById("list").innerHTML = req;
			}
		},
		error: function(xhr, type, errerThrown) {
			mui.toast(type);
//						console.log(xhr);
//						console.log(type);
//						console.log(errerThrown);
			//plus.nativeUI.closeWaiting();
		}
	});


	//已办
	var dolist = "";
	var myurl = get_Url() + '/iServer/gtasks/bpmMoveList';
//	var myurl = get_Url() + '/iServer/gtasks/hadListAll';
	var myData = {
		"loginUserCode": useruuid,
		'page':1,
		'rows':10
	}
	$.ajax({
		type:"get",
		url:myurl,
		data:myData,
		beforeSend: function() {
	       mui('#loadingPopover').popover('show');
	    },
	    complete: function() {
	       mui('#loadingPopover').popover('hide');
	    },
		success: function(data) {
//			console.log(data+'已办');
			var jsonData = JSON.parse(data);
			dodataList.splice(0, dodataList.length); //清空数组
			dodataList = jsonData.rows;
			var count = dodataList.length;
			for(var i = 0; i < count; i++) {
				dolist += '<li name="已办" class="mui-table-view-cell todoList-todoCell" id="' + i + '">';
				dolist += '<img class="mui-media-object mui-pull-left list-headImg" src="images/head2.png">';
				dolist += '<div class="mui-media-body">';
				dolist += '<a href="javascript:;" style="color:#1b82d2;">';
				dolist += '<span class="list-name">' + dodataList[i].userName + '</span> ';
				dolist += '</a>';
				var type = dodataList[i].instanceName;
				if(type == '交通费报销') {
					dolist += '<span class="list-chai" style="vertical-align: top;">交</span>';
				} else if(type == '差旅费报销' || type == '出差申请') {
					dolist += '<span class="list-chai" style="vertical-align: top;">差</span>';
				} else if(type == '通讯费报销') {
					dolist += '<span class="list-chai" style="vertical-align: top;">通</span>';
				} else if(type == '招待费报销' || type == '招待申请'){
					dolist += '<span class="list-chai" style="vertical-align: top;">待</span>';
				}else if(type == '会议费报销' || type == '会议费申请'){
					dolist += '<span class="list-chai" style="vertical-align: top;">会</span>';
				}else if(type == '加油费报销'){
					dolist += '<span class="list-chai" style="vertical-align: top;">油</span>';
				}else if(type == '其他费报销'){
					dolist += '<span class="list-chai" style="vertical-align: top;">其</span>';
				}else {
					dolist += '<span class="list-chai" style="vertical-align: top;">餐</span>';
				}
				dolist += '<span class="todoList-instanceName">' + dodataList[i].instanceName + ':</span>';	
				
				if(type == '出差申请') {
					dolist += '<span class="todoList-totalFee">' + dodataList[i].travelPlace + '</span>';
				}else if(type == '招待申请' || type == '会议费申请') {
					var expectedCost = formatCurrency(dodataList[i].expectedCost);
					dolist += '<span class="todoList-totalFee" >￥' + expectedCost + '</span>';
				}else{
					var totalFee = formatCurrency(dodataList[i].totalFee);
					dolist	 += '<span class="todoList-totalFee" >￥' + totalFee + '</span>';
				}
				//超限
                if(dodataList[i].isOverProof=='1'){
					dolist +='<img src="images/surpass.png" style="margin-left: 5px;width: 33px;height: 15px;"/>';
				}
				dolist += '<img src="images/right.png" class="mui-pull-right list-rightImg"/>';
				
				if(type == '招待申请' || type == '会议费申请'){
					dolist += '<p class="list-content">' + dodataList[i].receptionProject + '</p>';
				}else if(dodataList[i].travelReason == null){
					dolist += '<p class="list-content"></p>';
				}else{
					dolist += '<p class="list-content">' + dodataList[i].travelReason + '</p>';
				}
				
				dolist += '<span class="list-yihedui">' + dodataList[i].nextStatus + '</span>';
				var timeStr = get_Date((dodataList[i].createdTime / 1000));
				//截取字符串，显示月日时分
				var time = timeStr.substring(5, 16);
				dolist += '<span class="mui-pull-right list-time">' + time + '</span>';
				dolist += '</div>';
				dolist += '<div style="height: 0.5px;background: #eeeeee;margin-top: 10px;">';
				dolist += '</div>';
				dolist += '</li>';

			}
			document.getElementById("dolist").innerHTML = dolist;
		},
		error: function(xhr, type, errerThrown) {
			mui.toast(type);
//						console.log(xhr);
//						console.log(type);
//						console.log(errerThrown);
			//plus.nativeUI.closeWaiting();
		}
	});
//	mui.ajax(myurl, {
//		data: {
//			"loginUserCode": useruuid
//		},
//		dataType: '',
//		type: 'get',
//		headers:{
//		'token':token
//		},
//		beforeSend: function() {
//	       mui('#loadingPopover').popover('show');
//	    },
//	    complete: function() {
//	       mui('#loadingPopover').popover('hide');
//	    },
//		
//		error: function(xhr, type, errerThrown) {
//			mui.toast(type);
//		}
//	});
}