/*
 * Static-site glue for the restored Sobhan Galleries website.
 * Does in the browser what the original server used to do: search results,
 * the selected News & Events tab, and the newsletter error message.
 */
(function ($) {
	var scripts = document.getElementsByTagName('script');
	var me = document.currentScript || scripts[scripts.length - 1];
	var ROOT = me.getAttribute('data-root') || '';

	// Everything the site published (artists and exhibitions), newest first.
	var SEARCH_INDEX = [
  {
    "title": "Hani Najm ",
    "url": "single/14/Hani-Najm-.html",
    "img": "upload/content/medium/2016/03/12/6c23c1df11b80f61e1a08dba5bec8688.png"
  },
  {
    "title": "Raziyeh Poursalary",
    "url": "single/13/Raziyeh-Poursalary.html",
    "img": "upload/content/medium/2016/03/06/586cbfdcca650a3cd348257983c87a45.png"
  },
  {
    "title": "Arash Alimohammadi",
    "url": "single/12/Arash-Alimohammadi.html",
    "img": "upload/content/medium/2016/03/02/267e555478f463e5543d51c3c9924881.png"
  },
  {
    "title": "Imaginary Thoughts",
    "url": "single/11/Imaginary-Thoughts.html",
    "img": "upload/content/medium/2016/03/02/299622f566c51eae451175416057b0d1.png"
  },
  {
    "title": "Paradox  ; Time is on hold",
    "url": "single/10/Paradox---Time-is-on-hold.html",
    "img": "upload/content/medium/2016/03/02/0506fd0279aaaee550495883f929b303.png"
  },
  {
    "title": "Yatu",
    "url": "single/9/Yatu.html",
    "img": "upload/content/medium/2016/03/02/baf4295294acec8b2c8bc2a8138faa0e.png"
  },
  {
    "title": "Mashi and Mashianeh",
    "url": "single/8/Mashi-and-Mashianeh.html",
    "img": "upload/content/medium/2016/03/02/627df68ee07bb3ef100b7947fdf3c477.png"
  },
  {
    "title": "Between us and Nasim",
    "url": "single/7/Between-us-and-Nasim.html",
    "img": "upload/content/medium/2016/03/02/02b248b42d96d6a46e76434529e5eec7.png"
  }
];

	function param(name) {
		var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
		return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
	}
	function esc(s) {
		return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	// No newsletter backend any more: show the site's own error text instead of an endless spinner.
	$(document).ajaxError(function (event, xhr, settings) {
		if (settings.url && settings.url.indexOf('register_email') > -1) {
			$('#newsletter_validate_div').addClass('text-danger').removeClass('text-success')
				.html('Please try again in a few minutes again.<br> If you see this message again, please contact the site administrator.')
				.slideDown();
		}
	});

	// News & Events: mark the tab chosen with ?time_exhibition=N
	if (me.getAttribute('data-tabs')) {
		var tab = parseInt(param('time_exhibition'), 10);
		if (tab >= 1 && tab <= 4) $('.nav_sub_top .exhibition_search').eq(tab - 1).addClass('activ_color');
	}

	// Search: search.html?search_text=...&ContentContents_page=N
	if (me.getAttribute('data-search') && param('search_text') !== null) {
		var text = param('search_text');
		var q = $.trim(text).toLowerCase();
		var hits = $.grep(SEARCH_INDEX, function (item) { return item.title.toLowerCase().indexOf(q) > -1; });
		var perPage = 6;
		var pages = Math.max(1, Math.ceil(hits.length / perPage));
		var page = Math.min(Math.max(parseInt(param('ContentContents_page'), 10) || 1, 1), pages);

		var html = '';
		$.each(hits.slice((page - 1) * perPage, page * perPage), function (i, item) {
			html += '<div class="box_exhibi">\n    <a href="' + ROOT + item.url + '"><img src="' + ROOT + item.img + '" /></a>\n' +
				'    <ul>\n        <li><a href="' + ROOT + item.url + '">' + esc(item.title) + '</a></li>\n    </ul>\n</div>';
		});
		if (!hits.length) html = '<span class="empty"><div class="view"><div class="nothing-found">Nothing Found</div></div></span>';

		var $view = $('#yw0');
		$view.find('.items').html(html);
		$view.find('.pager').remove();
		if (pages > 1) {
			var link = function (n) {
				return ROOT + 'search.html?search_text=' + encodeURIComponent(text) + (n > 1 ? '&ContentContents_page=' + n : '');
			};
			var first = page === 1 ? ' hidden' : '', last = page === pages ? ' hidden' : '';
			var pager = '<div class="pager"><ul id="yw1" class="yiiPager">' +
				'<li class="first' + first + '"><a href="' + link(1) + '">&lt;&lt; First</a></li>\n' +
				'<li class="previous' + first + '"><a href="' + link(Math.max(page - 1, 1)) + '">Previous Page</a></li>\n';
			for (var n = 1; n <= pages; n++) {
				pager += '<li class="page' + (n === page ? ' selected' : '') + '"><a href="' + link(n) + '">' + n + '</a></li>\n';
			}
			pager += '<li class="next' + last + '"><a href="' + link(Math.min(page + 1, pages)) + '">Next Page</a></li>\n' +
				'<li class="last' + last + '"><a href="' + link(pages) + '">Last &gt;&gt;</a></li></ul></div>';
			$view.find('.items').after(pager);
		}
		$('.clist_view_search_input').val(text);
	}
})(jQuery);
