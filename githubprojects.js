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
			var content = "<table>";
			$.each(msg.repositories, function(i, val) {
				var githubUserUrl = "http://github.com/" + user + "/";
				var img = githubUserUrl + val.name + "/raw/master/.web/thumbnail.png";
				var url = githubUserUrl + val.name + "/tree/master";
				var item = "<tr><td>__NAME__</td><td><a href='__URL__'><img border='0' style='max-width:200px; max-height:200px; visibility:hidden;' src='__IMG__' onload='GithubProjects.showImage(this)'/></a></td><td>__DESCRIPTION__</td></tr>".replace("__NAME__", val.name).replace("__DESCRIPTION__", val.description).replace(/__IMG__/g, img).replace("__URL__", url);
				content += item;
			});
			content += "</table>"
			proj[0].innerHTML = content;
		}
	})
};
