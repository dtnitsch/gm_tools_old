function $id(x) { return document.getElementById(x) || false; }
function $tag(x) { return document.getElementsByTagName(x) || false; }
function $class(x) { return document.querySelector(set_class_dot(x)) || false; }
function $classes(x) { return document.querySelectorAll(set_class_dot(x)) || false; }
function $query(x) { return document.querySelectorAll(x) || false; }

function $error(msg) { console.log("Error: "+ msg); return false; }

function set_class_dot(x) { return (x[0] != "." ? "."+x : x); }
function isfunction(x) { return typeof x == "function"; }

function addclass(elem,classname) {
    if(typeof elem == 'string') { elem = $id(elem); }
    var list = elem.className;
    if(list == '' || typeof list == 'undefined') {
        list = classname;
    } else if(list.trim() != '') {
    	var re = new RegExp('(^| )'+ classname +'( |$)');
    	if(list.match(re)) { return true; }
        list += ' '+ classname;
    }
    elem.className = list;
    return true;
}
function removeclass(elem,classname) {
    if(typeof elem == 'string') { elem = $id(elem); }
    var list = elem.className;
    var re = new RegExp('(^| )'+ classname +'( |$)','g');
    list = list.replace(re,' ').trim();
    elem.className = list;
    return true;
}

/*
	Options and Examples:
	ajax('/ajax.php',{
		async: true
		,callback: _function_name_
		,debug: false ... or function_name - ajax_debugger
		,type: string (optional: xml, json, string)
		,method: post
		,params: post
	});
*/
function ajax(url,info) {
	var url = (typeof url == 'undefined' ? '' : url.trim());
	if(url == '') { return $error('A URL must be supplied!'); }

	info = info || {};
	info.debug = info.debug || false;
	info.async = info.async || true;
	info.callback = info.callback || '';
	info.type = info.type.toLowerCase() || 'string';
	info.success = info.success || '';
	info.method = info.method.toUpperCase() || 'POST';
	info.headers = info.headers || {
		"X-Requested-With": "XMLHttpRequest"
		,"Content-type": "application/x-www-form-urlencoded"
	}
	
	info.data = info.data || '';
	info.data = encodeURI(build_http_query(info.data));
	info.data = "ajax_call_type="+ info.type +'&'+ info.data;

	return run_ajax(url,info);
}

function run_ajax(url,info) {
	var ajax = new XMLHttpRequest();

	// if(info['method'].toUpperCase() == "GET") {
	// 	url += "?"+ info['data'];
	// }
	url += "?"+ info.data;
	ajax.open(info.method, url, info.async);
	
	// Send the proper header information along with the request
	if(Object.keys(info.headers).length) {
		for(i in info.headers) {
			ajax.setRequestHeader(i,info.headers[i]);
		}
	}
	
	ajax.onreadystatechange = function() {
		if(ajax.readyState == 4 && ajax.status == 200) {
			var r = ajax.responseText;
			if(info.type == 'json') { r = JSON.parse(r);	}
			if(isfunction(info.debug)) {
				r.debug = r.debug || '';
				info.debug(r.debug,ajax.responseText.length);
				r.debug = null;
			}
			if(info.callback) { info.callback(r); }
			if(isfunction(info.success)) { info.success(r); }
		}
	}
	ajax.send(data);
}

function show(elem) {
	if(typeof elem == 'string') { elem = $id(elem); }
	elem.style.display = 'inline';
}
function hide(elem) {
	if(typeof elem == 'string') { elem = $id(elem); }
	elem.style.display = 'none';
}
function show_hide(elem) { 
	if(typeof elem == 'string') { elem = $id(elem); }
	if(elem.style.display == '' || elem.style.display == 'inline') { elem.style.display = 'inherit'; }
	elem.style.display = (elem.style.display == 'none' ? 'inherit' : 'none');
}

function build_http_query(params) {
	var t = typeof params;
	if(t == 'string') { return params; }
	else if(t == 'array') {
		return params.join("&");
	} else if(t == 'object') {
		var output = '';
		for(var i in params) { output += i +"="+ params[i] +'&'; }
		return output.slice(0,-1);
	}
}

function build_post_variables(id) {
    var params = "";
    if($id(id)) {
	    var elems = $id(id).elements;
	    var current, i, len;
	    for(i=0, len = elems.length; i<len; i++) {
	        current = elems[i];

	        if(current.type == 'button' || current.type == 'submit') { continue; }
	        if(current.type == 'checkbox' || current.type == 'radio') {
	            if(current.checked) { params += current.name +'='+ current.value +'&'; }
	        } else {
	            params += current.name +'='+ current.value + '&';
	        }
	    }
	    // Remove the leading '&'
		return params.slice(0,-1);
    }
    return params;
}

function serialize (form) {
    'use strict';
    var i, j, len, jLen, elems, q = [];
    function encode (str) {
        // http://kevin.vanzonneveld.net
        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        // return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        //     replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
        return encodeURIComponent(str);
    }
    function param(name, value) {
        q[q.length] = encode(name) + '=' + encode(value);
    }
    if(typeof form == 'string') { form = $id(form); }
    // if (!form || !form.nodeName || form.nodeName.toLowerCase() !== 'form') {
    //     throw 'You must supply a form element';
    // }

    for (i = 0, len = form.elements.length; i < len; i++) {
        elems = form.elements[i];
        if (elems.name === '' || elems.disabled) {
            continue;
        }
        switch (elems.nodeName.toLowerCase()) {
        case 'input':
            switch (elems.type) {
            case 'text':
            case 'hidden':
            case 'password':
            case 'button': // Not submitted when submitting form manually, though jQuery does serialize this and it can be an HTML4 successful control
            case 'submit':
                param(elems.name, elems.value);
                break;
            case 'checkbox':
            case 'radio':
                if (elems.checked) {
                    param(elems.name, elems.value);
                }
                break;
            case 'file':
                // param(elems.name, elems.value); // Will work and part of HTML4 "successful controls", but not used in jQuery
                break;
            case 'reset':
                break;
            }
            break;
        case 'textarea':
            param(elems.name, elems.value);
            break;
        case 'select':
            switch (elems.type) {
            case 'select-one':
                param(elems.name, elems.value);
                break;
            case 'select-multiple':
                for (j = 0, jLen = elems.options.length; j < jLen; j++) {
                    if (elems.options[j].selected) {
                        param(elems.name, elems.options[j].value);
                    }
                }
                break;
            }
            break;
        case 'button': // jQuery does not submit these, though it is an HTML4 successful control
            switch (elems.type) {
            case 'reset':
            case 'submit':
            case 'button':
                param(elems.name, elems.value);
                break;
            }
            break;
        }
    }
    return build_http_query(q);
}