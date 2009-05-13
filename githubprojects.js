var GithubProjects = {};

GithubProjects.showImage = function(img) {
	img.style.visibility = 'visible';
};

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
				
				if (val.homepage != null && val.homepage != '') {
					var repo = url;
					url = val.homepage;
					name = "<a href='__URL__'>__NAME__</a><br/><font size='-2'><a href='__URL__'>[Home Page]</a><br/><a href='__REPO__'>[Source Code]</a></font>".replace("__REPO__", repo).replace(/__NAME__/g, name);
				}
				else {
					name = "<a href='__URL__'>__NAME__</a>".replace(/__NAME__/g, name);;
				}
				var item = "<tr align='center' __BGCOLOR__><td width='200'>__NAME__</td><td><a href='__URL__'><img border='0' style='max-width:200px; max-height:200px; visibility:hidden;' src='__IMG__' onload='GithubProjects.showImage(this)'/></a></td><td>__DESCRIPTION__</td></tr>".replace("__NAME__", name).replace("__DESCRIPTION__", val.description).replace(/__IMG__/g, img).replace(/__URL__/g, url).replace("__BGCOLOR__", bgcolor).replace(/__NAME__/g, name);
				content += item;
				background = !background;
			});
			content += "</table>"
			proj[0].innerHTML = content;
		}
	})
};

GithubProjects.FileExtensionsToBrushes = {
	'.cs' : 'c-sharp',
	'.java' : 'java',
	'.sh' : 'bash',
	'.cpp' : 'cpp',
	'.c' : 'c',
	'.pas' : 'pas',
	'.groovy' : 'groovy',
	'.js' : 'js',
// Perl seems to be broken currently.
//	'.pl' : 'pl',
//	'.perl' : 'perl',
	'.php' : 'php',
	'.txt' : 'text',
	'.py' : 'py',
	'.rb' : 'ruby',
	'.scala' : 'scala',
	'.sql' : 'sql',
	'.vb' : 'vb',
	'.xml' : 'xml',
	'.html' : 'html',
	'.xslt' : 'xslt',
	'.xhtml' : 'xhtml',
	'.xsd' : 'xml'
};

GithubProjects.Loaded = false;

GithubProjects.Fetch = function() {
	var files = $(".githubfile");
	if (!files) {
		return;
	}
	$.each(files, function(i, fileElement) {
		var repository = fileElement.attributes.repository["value"];
		var user = fileElement.attributes.user["value"];
		var file = fileElement.attributes.file["value"];
		GithubProjects.ShowFile(user, repository, file, fileElement); 
	});
};

GithubProjects.all = function() {
	if (!GithubProjects.Loaded) {
		GithubProjects.Loaded = true;
	 	$(document).ready(function() {
			GithubProjects.Fetch();
		});
	} else {
		GithubProjects.Fetch();
	}
};

GithubProjects.ShowFile = function(user, repository, file, element) {
	var githubUrl = "http://github.com/api/v2/json/";
	var branchesUrl = githubUrl + "repos/show/" + user + "/" + repository + "/branches";

	$.ajax({
		url: branchesUrl,
		type: "GET",
		dataType: "jsonp",
		success: function(msg) {
			var sha = msg.branches.master;
			var shaUrl = githubUrl + "blob/show/" + user + "/" + repository + "/" + sha + "/" + file;
			$.ajax({
				url: shaUrl,
				type: "GET",
				dataType: "jsonp",
				success: function(data) {
					var contents = data.blob.data;
					if ($.browser.mozilla) {
						element.textContent = contents;
					} else {
						element.innerText = contents;
					}
					var match = file.match(/\.[^.]+$/);
					if (match != null) {
						var brush = GithubProjects.FileExtensionsToBrushes[match[0]];
						if (brush != null) {
							$(element).addClass("brush:" + brush);
							//SyntaxHighlighter.all();
							SyntaxHighlighter.highlight(null, element);
						}
					}
				}
			});
		}
	});
};
