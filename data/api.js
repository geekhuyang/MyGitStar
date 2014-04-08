// GET
// e.php?term=eavesdrop
// return false意味着同时调用event.preventDefault()和event. stopPropagation()
// 因此要想停止事件冒泡,我们还得再调用后者。
$(document).ready(function() {
	$('#letter-e a').click(function(event) {
		event.preventDefault();
		var requestData = {term: $(this).text()};
		$.get('e.php', requestData, function(data) {
			$('#dictionary').html(data);
		});
	});
});


// POST
$(document).ready(function () {
	$('#letter-e a').click(function (event) {
		event.preventDefault();
		var requestData = {term: $(this).text()};
		$.post('e.php', requestData, function(data) {
			$('#dictionary').html(data);
		});
	});
});

// 序列化表单
// 使用.serialize()方法
// 这个方法作用于一个 jQuery对象,将匹配的DOM元素转换成能够随Ajax请求传递的查询字符串
$(document).ready(function () {
	$('#letter-f form').submit(function (event) {
		event.preventDefault();
		var formValues = $(this).serialize();
		$.get('f.php', formValues, function (data) {
			$('#dictionary').html(data);
		});
	});
});

// 当Ajax请求开始且尚未进行其他传输时,会触发.ajaxStart()的 回调函数。
// 相反,当最后一次活动请求终止时,则会执行通过.ajaxStop()注册的回调函数。
// 这些方法都与.ready()方法一样,只能由$(document)调用
$(document).ready(function () {
	$('<div id="loading">Loading...</div>').insertBefore('#dictionary')
});
$(document).ajaxStart(function () {
	$loading.show();
}).ajaxStop(function () {
	$loading.hide();
});


// 错误处理
// 除了使用全局的.ajaxError()方法,我们还可以利用jQuery的延迟对象系统
// 可以给.load()之外的Ajax方法连缀.done()、.always() 和.fail()方法,并通过它们添加相应的回调函数即可
// 400 请求语法错误
// 401 未授权
// 403 禁止访问
// 404 未发现请求的URL
// 500 服务器内部错误
$(document).ready(function () {
	$('#letter-e a').click(function (event) {
		event.preventDefault();
		var requestData = {term: $(this).text()};
		$.get('z.php', requestData, function (data) {
			$('#dictionary').html(data);
		}).fail(function (jqXHR) {
			$('#dictionary')
			.html('An error occurred: ' + jqXHR.status).append(jqXHR.responseText);
		});
	});
});

// 假设我们想让字典词条名来控制后面解释的可见性,即单击词条名可以显示或隐藏相应的解释。
$(document).ready(function() {
  $('h3.term').click(function() {
    $(this).siblings('.definition').slideToggle();
	});
});
// AJAX 事件委托

// 低级ajax 以下等价
// $('#dictionary').load('a.html')
// $.ajax({
//   url: 'a.html',
//   success: function(data) {
//     $('#dictionary').html(data);
//   }
// });
// 使用低级的$.ajax() 函数时,可以获得下列特殊的好处
// 避免浏览器缓存来自服务器的响应。非常适合服务器动态生成数据的情况
// 抑制正常情况下所有Ajax交互都可以触发的全局处理程序(例如通过$.ajaxStart()注册的处理程序)
// 在远程主机需要认证的情况下,可以提供用户名和密码

// 修改默认选项
// 使用$.ajaxSetup()函数可以修改调用Ajax方法时每个选项的默认值
// 之后的所有Ajax请求都将使用传递给该函数的选项——除非明确覆盖
$.ajaxSetup({
  url: 'a.html',
  type: 'POST',
  dataType: 'html'
});


$.ajax({
  type: 'GET',
  success: function(data) {
    $('#dictionary').html(data);
  }
});

// 要去掉页面中多余的内容,可以利用.load()的一些新特性——在指定要加载文档的URL时,
// 也可以提供一个jQuery选择符表达式。如果指定了这个表达式,.load()方法就会利用它查 5 找加载文档的匹配部分。
// 最终,只有匹配的部分才会被插入到页面中。
$('#dictionary').load('h.html .entry');

// 处理 Ajax 错误
// $.ajax()函数可以接收一个名为error的回调函数
// 触发这个错误回调函数的情况有很多种
// 服务器返回了错误状态码
// 服务器返回了间接的状态码,例如301 Moved Permanently
// 服务器返回的数据不能按照指定方式正确解析(例如,在dataType指定为json时,返回 的不是有效的JSON数据)
// XMLHttpRequest对象调用了.abort()
$.ajax({
  url: 'http://book.learningjquery.com/api/',
  dataType: 'jsonp',
  data: {
    title: $('#title').val()
  },
  success: response,
  error: function() {
    $response.html(failed);
  }
});

// 在没有既定的服务器端超时机制的情况下,我们可以在客户端强制设定请求的超时。通过给
// timeout选项传递一个以毫秒表示的时间值,
// 就相当于告诉$.ajax():如果响应在多长时间内没 有返回,那么就调用它自己的.abort()方法
$.ajax({
	url: 'http://book.learningjquery.com/api/',
	dataType: 'jsonp',
	data: {
    title: $('#title').val()
  },
  timeout: 15000,
  success: response,
  error: function() {
    $response.html(failed);
  }
});

// jQuery的所有Ajax方法都会返回jqXHR对象,只要把这个对象保存起来,随后就可以方便地 使用这些属性和方法
// 承诺方法
// 重写$.ajax()调用,把success和error回调函数替换
$.ajax({
  url: 'http://book.learningjquery.com/api/',
  dataType: 'jsonp',
  data: {
    title: $('#title').val()
  },
  timeout: 15000
})
.done(response)
.fail(function() {
  $response.html(failed);
});

$ajaxForm.on('submit', function(event) {
  event.preventDefault();
  $response.addClass('loading').empty();
  $.ajax({
    url: 'http://book.learningjquery.com/api/',
    dataType: 'jsonp',
    data: {
    	title: $('#title').val()
	  },
	  timeout: 15000
	})
	.done(response)
	.fail(function() {
	  $response.html(failed);
	})
	.always(function() {
	  $response.removeClass('loading');
	});
});

// 实现搜索功能时,越来越常见的一个功能是在用户输入过程动态地列出搜索结果来。
// 通过给 keyup事件绑定一个处理程序,我们也可以在jQuery API搜索中模拟这种实时的搜索功能
