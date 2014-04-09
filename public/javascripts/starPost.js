// 管理star页面的脚本
$(document).ready(function () {
	"use strict";

	var isUpdating = false;
	var shortTimeout = 10000;
	var removeTimeout = 3000;

	// 为导航菜单加active
	var active = $('#navHeader').attr('data-active');
	if (active) {
		$('#' + active).addClass('active');
	}

	// 备注提示
	$('.tab-content').mouseover(function (e) {
		$(e.target).closest('li').tooltip('show');
	});

	// 点击分类tab，显示对应content
	$('#myTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	// 为第一个标签页和标签内容加active
	$('#myTab').find('li').first().addClass('active');
	$('.tab-content').find('div').first().addClass('active in');

	// 点击某个star项目，显示modal，事件委托在tab-content父元素上
	$('.tab-content').click(function (e) {
		e.preventDefault();
		var $li = $(e.target).closest('li');
		var text = $li.find('.star-name').text();
		var description = $li.find('.star-description').text();
		var owner = $li.find('.star-owner').text();
		var $myModal = $('#myModal');
		// 信息数据
		$myModal.find('.modal-id').val($li.attr('data-id'));
		$myModal.find('.modal-title').text(text);
		$myModal.find('.modal-owner').text(owner);
		$myModal.find('.modal-language').text($li.find('.star-language').text());
		$myModal.find('.modal-starNum').text($li.attr('data-starNum'));
		$myModal.find('.modal-forkNum').text($li.attr('data-forkNum'));
		// $myModal.find('.modal-repoId').text('ID: ' + $li.attr('data-id'));
		$myModal.find('.modal-description').text(description);
		$myModal.find('.modal-htmlurl').attr({'href': $li.attr('data-htmlurl')});
		// $myModal.find('.modal-readme').attr({'href': '/readme?author=' + owner + '&repo=' + text});
		// $myModal.find('.modal-size').text($li.attr('data-size') + 'KB');
		$myModal.find('#readmeBtn').attr({
			'href': '/readme?author=' + owner + '&repo=' + text,
			'data-target': '#readme-' + $li.attr('data-id')
		});
		// 表单数据
		var category = $li.attr('data-category');
		$myModal.find('.modal-category input').text(category);
		$myModal.find('.modal-category input').val(category);
		// var tags = $li.attr('data-tags').split(',').join(' ');
		// $myModal.find('.modal-tags input').text(tags);
		// $myModal.find('.modal-tags input').val(tags);
		var remark = $li.attr('data-remark');
		$myModal.find('.modal-remark textarea').text(remark);
		$myModal.find('.modal-remark textarea').val(remark);
		$('#myModal').modal();
	});

	// 按星数量排序
	$('#sortByStar').click(function (event) {
		event.preventDefault();
		var ol = $('.tab-pane.active').find('ol');
		var liSet = ol.find('li');
		var tmpSet = [];
		liSet.each(function () {
			var num = Number($(this).attr('data-starNum'));
			var tmp = {};
			tmp.num = num;
			tmp.li = $(this);
			tmpSet.push(tmp);
		});
		tmpSet = tmpSet.sort(function (itemA, itemB) { return itemB.num - itemA.num; });
		tmpSet.forEach(function (item, index) {
			item.li.find('.item-order').text(index + 1);
			item.li.remove();
			item.li.appendTo(ol);
		});
	});

	// 按创建star时间排序
	var timeDirection = true;
	$('#sortByTime').click(function (event) {
		event.preventDefault();
		var ol = $('.tab-pane.active').find('ol');
		var liSet = ol.find('li');
		var tmpSet = [];
		liSet.each(function () {
			var order = Number($(this).attr('data-order'));
			var tmp = {};
			tmp.order = order;
			tmp.li = $(this);
			tmpSet.push(tmp);
		});
		if (timeDirection) {
			tmpSet = tmpSet.sort(function (itemA, itemB) { return itemA.order - itemB.order; });
		} else {
			tmpSet = tmpSet.sort(function (itemA, itemB) { return itemB.order - itemA.order; });
		}
		timeDirection = !timeDirection;
		tmpSet.forEach(function (item, index) {
			item.li.find('.item-order').text(index + 1);
			item.li.remove();
			item.li.appendTo(ol);
		});
	});

	// auto remove
	var autoremove = function (entry, timeout) {
		if (entry) {
			setTimeout(function () {
				if (entry) {
					entry.animate({ opacity: 0 }, 300, function () { if (entry) { entry.remove(); }});
				}
			}, timeout);
		}
	};

	// 表单处理
	$('#myModal form').submit(function (event) {
		event.preventDefault();
		var requestData = $(this).serialize();
		requestData += '&action=update';
		console.log(requestData);
		if (!isUpdating) {
			$.ajax({
				type: 'POST',
				timeout: shortTimeout,
				url: '/ajaxPost',
				data: requestData,
				success: function (data) {
					isUpdating = false;
					data = JSON.parse(data);
					// ajax成功
					if (data.status) {
						var $li = $('#star-' + data.starid);
						$li.attr({'data-remark': data.remark});
						$li.attr({'data-original-title': data.remark});
						// $li.attr({'data-tags': data.tags});
						$li.attr({'data-category': data.category});
						// 将category进行编码
						var result = [];
						for (var j = 0; j < data.category.length; j++) {
							result.push(data.category.charCodeAt(j));
						}
						data.categoryCodes = result.join('-');
						var $category = $('#content-' + data.categoryCodes);

						if ($li.length) {
							if ($category.length) {
								var $oldCategory = $li.closest('div.tab-pane');
								if (data.categoryCodes === $oldCategory.attr('id').replace('content-', '')) {
									// 分类不变
								} else {
									// 解决li之后的编号
									$li.nextAll().each(function () {
										var order = $(this).find('.item-order').text();
										$(this).find('.item-order').text(--order);
									});
									var newOl = $category.find('ol').first();
									$li.find('.item-order').text(newOl.find('li').length + 1);
									$li.appendTo(newOl);
									// 如果旧分类走了li之后长度为0
									if ($oldCategory.find('li').length === 0) {
										var id = $oldCategory.attr('id');
										id = id.replace('content', 'tab');
										$('#' + id).remove();
										$oldCategory.remove();
										$category.addClass('active in');
										var newid = $category.attr('id');
										newid = newid.replace('content', 'tab');
										$('#' + newid).addClass('active');
									} else {
										// 减少old tab记录的数量
										var id3 = $oldCategory.attr('id');
										id3 = id3.replace('content', 'tab');
										$('#' + id3).find('.badge').text($oldCategory.find('li').length);
									}
									// 增加new tab记录的数量
									var id4 = $category.attr('id');
									id4 = id4.replace('content', 'tab');
									$('#' + id4).find('.badge').text($category.find('li').length);
								}
								var $success = $('<div class="row alert alert-success alert-dismissable"><button class="close" type="button" data-dismiss="alert" aria-hidden="true">&times;</button><p>更新成功</p></div>');
								$success.prependTo($('.infoBox')[0]);
								autoremove($success, removeTimeout);
							} else {
								// 旧分类
								var $oldCategory2 = $li.closest('div.tab-pane');

								// 解决li之后的编号
								$li.nextAll().each(function () {
									var order = $(this).find('.item-order').text();
									$(this).find('.item-order').text(--order);
								});

								$li.find('.item-order').text('1');

								var $newCategory = $('<div id="content-' + data.categoryCodes +
									'" class="tab-pane fade"><section id="star"><ol></ol></section></div>');
								$newCategory.appendTo($('div.tab-content')[0]);
								var $ol = $newCategory.find('ol').first();
								$li.prependTo($ol);
								var $newTab = $('<li id="tab-' + data.categoryCodes + '"><a data-toggle="tab" href="#content-' + data.categoryCodes + '">' + data.category + '<span class="badge">1</span></a></li>');
								$newTab.appendTo($('#myTab')[0]);

								if ($oldCategory2.find('li').length === 0) {
									var id5 = $oldCategory2.attr('id');
									id5 = id5.replace('content', 'tab');
									$('#' + id5).remove();
									$oldCategory2.remove();
									$newTab.addClass('active');
									$newCategory.addClass('active in');
								} else {
									// 减少old tab记录的数量
									var id6 = $oldCategory2.attr('id');
									id6 = id6.replace('content', 'tab');
									$('#' + id6).find('.badge').text($oldCategory2.find('li').length);
								}
								var submitSuccess = $('<div class="row alert alert-success alert-dismissable"><button class="close" type="button" data-dismiss="alert" aria-hidden="true">&times;</button><p>更新成功</p></div>');
								submitSuccess.prependTo($('.infoBox')[0]);
								autoremove(submitSuccess, removeTimeout);
							}
						} else {
							var $error = $('<div class="row alert alert-danger alert-dismissable"><button class="close" type="button" data-dismiss="alert" aria-hidden="true">&times;</button><p>找不到元素</p></div>');
							$error.prependTo($('.infoBox')[0]);
							autoremove($error, removeTimeout);
						}
					} else {
						// ajax失败 
						var submitError = $('<div class="row alert alert-danger alert-dismissable"><button class="close" type="button" data-dismiss="alert" aria-hidden="true">&times;</button><p>' + data.message + '</p></div>');
						submitError.prependTo($('.infoBox')[0]);
						autoremove(submitError, removeTimeout);
					}
				},
				error: function () {
					isUpdating = false;
					var $error = $('<div class="row alert alert-danger alert-dismissable"><button class="close" type="button" data-dismiss="alert" aria-hidden="true">&times;</button><p>更新超时</p></div>');
					$error.prependTo($('.infoBox')[0]);
					autoremove($error, removeTimeout);
				}
			});
			isUpdating = true;
			$('#myModal').modal('hide');
		} else {
			$('#myModal').modal('hide');
			var show = $('<div class="row alert alert-danger alert-dismissable"><button class="close" type="button" data-dismiss="alert" aria-hidden="true">&times;</button><p>请等待上次操作反馈后再提交更新..</p></div>');
			show.prependTo($('.infoBox')[0]);
			autoremove(show, removeTimeout);
		}
	});

	// readnme 按钮
	$('#readmeBtn').click(function (event) {
		event.preventDefault();
		var $modal = $(this).closest('.modal');
		var id = $modal.find('.modal-id').val();
		console.log('id: ', id);
		$('#myModal').modal('hide');
		// 是否已经缓存过readme页面
		if ($('#readme-' + id).length) {
			console.log('exist');
			$('#readme-' + id).modal('show');
		} else {
			console.log('create');
			var modal = $('<div id="readme-' + id + '" class="modal fade"></div>');
			var modalDialog = $('<div class="modal-dialog"></div>');
			var modalContent = $('<div class="modal-content"></div>');
			var modalHeader = $('<div class="modal-header"></div>');
			var button = $('<button class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button>');
			var p = $('<p class="modal-title">加载中..</p>');
			var modalFooter = $('<div class="modal-footer"></div>');

			button.appendTo(modalHeader);
			p.appendTo(modalHeader);
			modalHeader.appendTo(modalContent);
			modalFooter.appendTo(modalContent);
			modalContent.appendTo(modalDialog);
			modalDialog.appendTo(modal);
			modal.appendTo($('#container')[0]);
			modal.modal({'remote': $(this).attr('href')});
		}
	});

	// ajax事件提示
	$(document).ajaxStart(function () {
		var $loading = $('<div id="loading-info" class="row alert alert-info alert-dismissable"><button class="close" type="button" data-dismiss="alert" aria-hidden="true">&times;</button><p>请等待服务器反馈..</p></div>');
		$loading.prependTo($('.infoBox')[0]);
		autoremove($loading, removeTimeout);
	}).ajaxStop(function () {
		if ($('#loading-info').length) { $('#loading-info').remove(); }
	});
});
