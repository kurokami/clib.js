// function insertAfter to insertBefore

function insertAfter(parentNode, insertedNode, adjacentNode) {
	if(adjacentNode.nextSibling) 
		parentNode.insertBefore(insertedNode, adjacentNode.nextSibling);
	else 
		parentNode.appendChild(insertedNode);
}

// function getlementsByClassName

if(document.getElementsByClassName) {
	getElementsByClass = function(classList, node) {    
		return (node || document).getElementsByClassName(classList)
	}
} else {
	getElementsByClass = function(classList, node) {			
		node = node || document;
		nodes = node.getElementsByTagName('*'); 
		classes = classList.split(/\s+/);
		result = [];
		for(i = 0; i < nodes.length; i++) {
			for(j = 0; j < classes.length; j++)  {
				if(nodes[i].className.search('\\b' + classes[j] + '\\b') != -1) {
					result.push(nodes[i]);
					break;
				}
			}
		}
		return result;
	}
}

function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}
 
function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}

// Cookies functions

function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
	  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	))
	return matches ? decodeURIComponent(matches[1]) : undefined 
}

function setCookie(name, value, props) {
	props = props || {}
	var exp = props.expires
	if (typeof exp == "number" && exp) {
		var d = new Date()
		d.setTime(d.getTime() + exp*1000)
		exp = props.expires = d
	}
	if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }

	value = encodeURIComponent(value)
	var updatedCookie = name + "=" + value
	for(var propName in props){
		updatedCookie += "; " + propName
		var propValue = props[propName]
		if(propValue !== true){ updatedCookie += "=" + propValue }
	}
	document.cookie = updatedCookie

}

function deleteCookie(name) {
	setCookie(name, null, { expires: -1 })
}

// ajax functions

function XMLHTTP() {
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

function build_str(arr, delim) {
	delim = delim || "&";
	if(typeof arr != "object")
		return;
	var result="";
	for(var i in arr)
		result += (result != "" ? delim : "") + i + "=" + arr[i];
	return result;
}

function ajax(param) {
	var req = new XMLHTTP();
	var method = (!param.method ? "GET" : param.method.toUpperCase());
	var send = (method == "GET" ? null : (param.data ? build_str(param.data) : null));
	req.open(method, param.url, true);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	req.send(send);
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			if(param.success) param.success(req.responseText, req.responseXML);
		}
	}
}

/* usage
	ajax({url:frm.action,
		method:frm.method,
		data:{login:frm.login.value,password:frm.password.value},
		success:function(text, xml) {
			alert(text);
		}
	})
*/

// events function

function addEvent(obj, type, handler) {
  if (obj.setInterval && ( obj != window && !obj.frameElement ) ) {
	obj = window;
  }
  if (!obj.events) {
	obj.events = {}
	obj.handle = function(Event) {
	  if (typeof Event !== "undefined") {
		return commonHandler.call(obj, event);
	  }
	}
  }
  if (!obj.events[type]) {
    obj.events[type] = [];        
    if (obj.addEventListener)
      obj.addEventListener(type, obj.handle, false);
    else if (obj.attachEvent)
      obj.attachEvent("on" + type, obj.handle);
  }
  handler.guid = obj.events[type].lenght;
  obj.events[type][handler.guid] = handler;
  return handler;
}

function removeEvent(obj, type, handler) {
  var handlers = obj.events && obj.events[type] ;
  if (!handlers) return
  delete handlers[handler.guid];
  for(var any in handlers) return
  if (obj.removeEventListener)
    obj.removeEventListener(type, obj.handle, false)
  else if (obj.detachEvent)
    obj.detachEvent("on" + type, obj.handle)
  delete obj.events[type]
  for (var any in elem.events) return
  try {
    delete obj.handle
    delete obj.events 
  } catch(e) {
    obj.removeAttribute("handle")
    obj.removeAttribute("events")
  }
}

function commonHandler(event) {
  event = fixEvent(event);
  var handlers = this.events[event.type];
  for ( var g in handlers ) {
    var ret = handlers[g].call(this, event);
    if ( ret === false ) {
        event.preventDefault();
        event.stopPropagation();
    }
  }
}

function fixEvent(event) {
  event = event || window.event;
  if ( event.isFixed ) {
    return event;
  }
  event.isFixed = true;
  event.preventDefault = event.preventDefault || function(){this.returnValue = false};
  event.stopPropagation = event.stopPropagaton || function(){this.cancelBubble = true};
  if (!event.target) {
      event.target = event.srcElement;
  }
  if (!event.relatedTarget && event.fromElement) {
      event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
  }
  if ( event.pageX == null && event.clientX != null ) {
      var html = document.documentElement, body = document.body;
      event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
      event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
  }
  if ( !event.which && event.button ) {
      event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
  }
  return event
}
