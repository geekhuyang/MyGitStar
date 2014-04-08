$(document).ready(function () {
	"use strict";

	// 为导航菜单加active
	var active = $('#navHeader').attr('data-active');
	$('#' + active).addClass('active');
});
