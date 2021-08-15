function jsonFlickrApi(rsp)
{
    window.rsp = rsp;
    var s = "";
    // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
    // http://www.flickr.com/photos/{user-id}/{photo-id}
    s = "total number is: " + rsp.photos.photo.length + "<br/>";

    for (var i=0; i < rsp.photos.photo.length; i++)
    {
        photo = rsp.photos.photo[i];
        /*t_url = "http://farm" + photo.farm + ".static.flickr.com/" +
                photo.server + "/" + photo.id + "_" + photo.secret + "_" + "b.jpg";
        p_url = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
                s +=  '<a href="' + p_url + '">' + '<img alt="'+ photo.title +
                '"src="' + t_url + '"/>' + '</a>';
        */

        t_url = "http://farm" + photo.farm + ".static.flickr.com/" +
                photo.server + "/" + photo.id + "_" + photo.secret + "_" + "b.jpg";
        s += '<a href="javascript:void(0)">' + '<img alt="'+ photo.title + '"src="' + t_url + '"/>' + '</a>';
    }
    document.writeln(s);
}