// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
// "{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")

/*function display_hint1(photos)  // bing
{
    console.log(photos);
    var hint = document.getElementById('hint1');
    hint.innerHTML = "提示1: <br>";

    var i = 0;
    //for (var i = 0; i < Math.min(photos.length, 21); i++)
    for (var j = photos.length - 1; j >= 0; j--, i++)
    {
        var photo = photos[j];
        var elm = document.createElement("img");
        var imgSrc = photo['thumbnail'];
        elm.src = imgSrc;
        elm.style.width = "60px";
        elm.style.height = "60px";
        elm.setAttribute('onmouseover', 'document.getElementById("photo").src="{0}"'.format(imgSrc));
        hint.appendChild(elm);
        //console.log("elm", elm.src);
        if (i >= 20)
            break;
    }
}*/

function display_hint1(photos)  // Flickr
{
    console.log(photos);
    var hint = document.getElementById('hint1');
    hint.innerHTML = "提示1: <br>";

    for (var i = 0; i < photos.length; i++)
    {
        var photo = photos[i];
        var elm = document.createElement("img");
        var b_src = "http://farm{0}.static.flickr.com/{1}/{2}_{3}_b.jpg".format(photo['farm'], photo['server'], photo['id'], photo['secret']);
        var s_src = "http://farm{0}.static.flickr.com/{1}/{2}_{3}_s.jpg".format(photo['farm'], photo['server'], photo['id'], photo['secret']);
        elm.src = s_src
        elm.setAttribute('onmouseover', 'document.getElementById("photo").src="{0}"'.format(b_src));
        //elm.setAttribute('onmouseout', 'this.src="{0}"'.format(s_src));
        hint.appendChild(elm);
        console.log("elm", elm.src);
    }
}


function display_hint2(answer)
{
    var hint = document.getElementById('hint2');
    hint.innerHTML = "提示2: " + answer;
}

function display_hint3(answer)
{
    var hint = document.getElementById('hint3');
    hint.innerHTML = "提示3: ";

    var elm = document.createElement("a");
    elm.innerHTML = answer;
    hint.appendChild(elm);
}

function display_guess(playerNo, guess, isCorrect)
{
    var message = document.getElementById('message');
    var elm = document.createElement("div");
    var player = playerNo == gPlayerNo ? "你" : "對方";
    var res = isCorrect ? "(O)   " : "(X)   ";
    elm.innerHTML = res + player + "猜 " + guess;
    //message.appendChild(elm);
    message.insertBefore(elm, message.firstChild);
}

function display_score(score)
{
    var score0 = document.getElementById('score0');
    var score1 = document.getElementById('score1');
    if (gPlayerNo == 0)
    {
        score0.innerHTML = score[0];
        score1.innerHTML = score[1];
    }
    else
    {
        score0.innerHTML = score[1];
        score1.innerHTML = score[0];
    }
}

function display_answer(answer)
{
    var message = document.getElementById('message');
    var elm = document.createElement("div");
    elm.innerHTML = "正確答案: " + answer;
    message.insertBefore(elm, message.firstChild);
}