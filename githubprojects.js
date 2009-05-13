var GithubProjects = {};

GithubProjects.showImage = function(img) {
	img.style.visibility = 'visible';
}

GithubProjects.ShowRepository = function(user, elementId) {
	var githubUrl = "http://github.com/api/v2/json/";
	var reposUrl = githubUrl + "repos/show/" + user;
	$.ajax({
		url: reposUrl,
		type: "GET",
		dataType: "jsonp",
		success: function(msg) {
			var proj = $("#" + elementId);
			var content = "<table cellspacing='0' cellpadding='20'>";
			var background = false;
			$.each(msg.repositories, function(i, val) {
				var githubUserUrl = "http://github.com/" + user + "/";
				var img = githubUserUrl + val.name + "/raw/master/.web/thumbnail.png";
				var url = githubUserUrl + val.name + "/tree/master";
				var bgcolor = background ? "bgcolor='#EFEFEF'" : "";
				var name = val.name;
				
				if (val.homepage != null) {
					var repo = url;
					url = val.homepage;
					name = "<a href='__URL__'>__NAME__</a><br/><font size='-2'><a href='__URL__'>[Home Page]</a><br/><a href='__REPO__'>[Source Code]</a></font>".replace("__NAME__", name).replace("__URL__", url).replace("__REPO__", repo);
				}
				else {
					name = "<a href='__URL__'>__NAME__</a>".replace("__NAME__", name).replace("__URL__", url);
				}
				var item = "<tr align='center' __BGCOLOR__><td width='200'>__NAME__</td><td><a href='__URL__'><img border='0' style='max-width:200px; max-height:200px; visibility:hidden;' src='__IMG__' onload='GithubProjects.showImage(this)'/></a></td><td>__DESCRIPTION__</td></tr>".replace("__NAME__", name).replace("__DESCRIPTION__", val.description).replace(/__IMG__/g, img).replace("__URL__", url).replace("__BGCOLOR__", bgcolor);
				content += item;
				background = !background;
			});
			content += "</table>"
			proj[0].innerHTML = content;
		}
	})
};
