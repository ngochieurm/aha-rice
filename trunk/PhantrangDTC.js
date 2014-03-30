// -----------------------------------------------------------------------------------------
// Table of Content for Blogger with Pagination
// Original: http://vagabundia.blogspot.com/2011/04/resumen-de-entradas-con-paginacion.html
// Visit: http://kartriderdautocrazy01.blogspot.com
// -----------------------------------------------------------------------------------------

var minpage = 6; // Minimum number to display the page
var maxpage = 10; // The maximum number of pages to display
var firstpage = 0; // Detect the first time it is executed
var pagernum = 0; // Contain the page number where we
var postsnum = 0; // Start the first page
var actualpage = 1; // Starting value of the current page (it will change if you click the pagination).

// This is the container template that will be used to insert post template, pagination and the posts count
document.write('<div id="toc-outer"><div id="results"></div><div id="itempager" style="position:relative;"><div id="pagination"></div><div id="totalposts"></div><a title="DauToCrazy" style="display:block!important;visibility:visible!important;opacity:1!important;position:absolute;bottom:10px;right:14px;font:normal bold 8px Arial,Sans-Serif!important;color:#666;text-shadow:0 1px 0 rgba(255,255,255,.1);text-decoration:none;" href="http://kartriderdautocrazy01.blogspot.com/2013/04/tao-trang-rieng-chua-tien-ich-phan.html" target="_blank">&#9658;DTC</a></div></div>');

var _results = document.getElementById('results');
var _pagination = document.getElementById('pagination');
var _totalposts = document.getElementById('totalposts');

// Build the table of contents framework

function showPagePosts(json) {

    var entry, posttitle, posturl, postimg, postsumm, replies, monthnames, timepub, output = "";

    if (pagernum == 0) {
        postsnum = parseInt(json.feed.openSearch$totalResults.$t);
        pagernum = parseInt(postsnum / postsperpage) + 1;
    }

    for (var i = 0; i < postsperpage; i++) {

        if (i == json.feed.entry.length) break;

        entry = json.feed.entry[i];
        posttitle = entry.title.$t; // Get the post title

        // Get rel="alternate" for truly post url
        for (var k = 0, elen = entry.link.length; k < elen; k++) {
            if (entry.link[k].rel == 'alternate') {
                posturl = entry.link[k].href; // This is your real post URL!
                break;
            }
        }

        // Get the comments count
        for (var l = 0, clen = entry.link.length; l < clen; l++) {
            if (entry.link[l].rel == "replies" && entry.link[l].type == "text/html") {
                var commentsnum = entry.link[l].title.split(" ")[0]; // This is your comments count
                break;
            }
        }

        // If the Blogger-feed is set to SHORT, then the content is in the summary-field
        postsumm = ("summary" in entry) ? entry.summary.$t.replace(/<br ?\/?>/ig, " ").replace(/<(.*?)>/g, "") : ""; // Get the post summary

        // Reduce post summaries to "numchars" characters.
        // "numchars" is a variable. You determine the value
        if (postsumm.length > numchars) {
            postsumm = (numchars > 0 && numchars !== false) ? postsumm.substring(0, numchars) + '...' : "";
        }

        // Get the post date (e.g: 2012-02-07T12:56:00.000+07:00)
        var _postdate = entry.published.$t,
            _cdyear = _postdate.substring(0, 4), // Take 4 characters from the "postdate" beginning, it means the year (2012)
            _cdmonth = _postdate.substring(5, 7), // Take 2 character 5 step from "postdate" beginning, it mean the month (02)
            _cdday = _postdate.substring(8, 10); // Take 2 character 8 step from "postdate" beginning. it means the day (07)

        // Month array template
        monthnames = (idMode) ? ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // The final product of the post date = (07 Feb 2012) (cdday monthnames cdyear)
        timepub = (showPostDate) ? _cdday + ' ' + monthnames[parseInt(_cdmonth, 10) - 1] + ' ' + _cdyear + ' - ' : '';

        // The final product of the comments count & comments label (10 Komentar) (commentsnum commentsLabel)
        replies = (showComments) ? commentsnum + ' ' + commentsLabel : '';

        // Get the post thumbnails
        postimg = ("media$thumbnail" in entry) ? entry.media$thumbnail.url : imgBlank;

        // Build the post template
        output += '<div class="itemposts">';
        output += '<h6><a href="' + posturl + '" target="_blank">' + posttitle + '</a></h6>';
        output += '<div class="iteminside"><a href="' + posturl + '" target="_blank"><img src="' + postimg + '" /></a>';
        output += '<span class="summary">' + postsumm + '</span></div>';
        output += '<div style="clear:both;"></div><div class="itemfoot">' + timepub + replies + '<a class="itemrmore" href="' + posturl + '" target="_blank">' + rmoreText + '</a></div>';
        output += '</div>';

    }

    // Put the whole template above into <div id="results"></div>
    _results.innerHTML = output;
    _create_pagination();

}

// Build the pagination
function _create_pagination() {

    output = "";
    var starter = 0;

    output += (actualpage > 1) ? '<a title="' + prevText + '" class="prevjson" href="javascript:_init_script(' + parseInt(actualpage - 1) + ')">' + prevText + '</a>' : '<span class="prevjson hidden">' + prevText + '</span>';

    if (pagernum < (maxpage + 1)) {
        for (starter = 1; starter <= pagernum; starter++) {
            output += (starter == actualpage) ? '<span class="actual">' + starter + '</span>' : '<a href="javascript:_init_script(' + starter + ')">' + starter + '</a>';
        }
    } else if (pagernum > (maxpage - 1)) {
        if (actualpage < minpage) {
            for (starter = 1; starter < (maxpage - 2); starter++) {
                output += (starter == actualpage) ? '<span class="actual">' + starter + '</span>' : '<a href="javascript:_init_script(' + starter + ')">' + starter + '</a>';
            }
            output += ' ... ';
            output += '<a href="javascript:_init_script(' + parseInt(pagernum - 1) + ')">' + parseInt(pagernum - 1) + '</a>';
            output += '<a href="javascript:_init_script(' + pagernum + ')">' + pagernum + '</a>';
        } else if (pagernum - (minpage - 1) > actualpage && actualpage > (minpage - 1)) {
            output += '<a href="javascript:_init_script(1)">1</a>';
            output += '<a href="javascript:_init_script(2)">2</a>';
            output += ' ... ';
            for (starter = actualpage - 2; starter <= actualpage + 2; starter++) {
                output += (starter == actualpage) ? '<span class="actual">' + starter + '</span>' : '<a href="javascript:_init_script(' + starter + ')">' + starter + '</a>';
            }
            output += ' ... ';
            output += '<a href="javascript:_init_script(' + parseInt(pagernum - 1) + ')">' + parseInt(pagernum - 1) + '</a>';
            output += '<a href="javascript:_init_script(' + pagernum + ')">' + pagernum + '</a>';
        } else {
            output += '<a href="javascript:_init_script(1)">1</a>';
            output += '<a href="javascript:_init_script(2)">2</a>';
            output += ' ... ';
            for (starter = pagernum - (minpage + 1); starter <= pagernum; starter++) {
                output += (starter == actualpage) ? '<span class="actual">' + starter + '</span>' : '<a href="javascript:_init_script(' + starter + ')">' + starter + '</a>';
            }
        }
    }

    output += (actualpage < starter - 1) ? '<a title="' + nextText + '" class="nextjson" href="javascript:_init_script(' + parseInt(actualpage + 1) + ')">' + nextText + '</a>' : '<span class="nextjson hidden">' + nextText + '</span>';

    _pagination.innerHTML = output;
    var parameter = (actualpage * postsperpage) - (postsperpage - 1),
        _final = actualpage * postsperpage;
    _totalposts.innerHTML = totalPostLabel + ' ' + postsnum + ' - ' + jumpPageLabel + ' ' + parameter + ' - ' + _final;
}

// Functions to remove and append the callback script that has been manipulated in the `start-index` parameter
function _init_script(n) {

    var parameter = (n * postsperpage) - (postsperpage - 1);
    var url = (sortByLabel) ? siteUrl + '/feeds/posts/summary/-/' + labelSorter + '?start-index=' + parameter : siteUrl + '/feeds/posts/summary/?start-index=' + parameter; // Optional: Sort posts by a specific label

    if (firstpage == 1) {
        var old = document.getElementById("TEMPORAL");
        old.parentNode.removeChild(old);
    }
    _results.innerHTML = '<div id="loadingscript">' + loadingText + '</div>';
    _pagination.innerHTML = '';
    _totalposts.innerHTML = '';

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + '&max-results=' + postsperpage + '&orderby=published&alt=json-in-script&callback=showPagePosts';
    script.id = 'TEMPORAL';
    document.getElementsByTagName('head')[0].appendChild(script);
    firstpage = 1;
    actualpage = n;
}

// Execute the _init_script() function with parameter as `1` on page load
// So it will show the first page.
window.onload = function () {
    _init_script(1);
};