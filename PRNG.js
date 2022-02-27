/*
    Pseudo-random number generator
    From https://www.grc.com/js/uheprng.js
    Code is in the Public Domain.
    Date Accessed: 26-02-2022
    Minified by https://jscompress.com/
*/
"use strict";function uheprng(){return function(){for(var r,t=48,e=1,o=t,a=new Array(t),i=0,f=Mash(),u=0;u<t;u++)a[u]=f(Math.random());function c(){++o>=t&&(o=0);var n=1768863*a[o]+2.3283064365386963e-10*e;return a[o]=n-(e=0|n)}function h(n){return Math.floor(n*(c()+11102230246251565e-32*(2097152*c()|0)))}return h.string=function(n){for(var r="",t=0;t<n;t++)r+=String.fromCharCode(33+h(94));return r},h.cleanString=function(n){return n=(n=(n=n.replace(/(^\s*)|(\s*$)/gi,"")).replace(/[\x00-\x1F]/gi,"")).replace(/\n /,"\n")},h.hashString=function(n){for(n=h.cleanString(n),f(n),u=0;u<n.length;u++)for(i=n.charCodeAt(u),r=0;r<t;r++)a[r]-=f(i),a[r]<0&&(a[r]+=1)},h.addEntropy=function(){var n=[];for(u=0;u<arguments.length;u++)n.push(arguments[u]);!function(){var n=Array.prototype.slice.call(arguments);for(u=0;u<n.length;u++)for(r=0;r<t;r++)a[r]-=f(n[u]),a[r]<0&&(a[r]+=1)}(i+++(new Date).getTime()+n.join("")+Math.random())},h.initState=function(){for(f(),u=0;u<t;u++)a[u]=f(" ");e=1,o=t},h.done=function(){f=null},h}()}function Mash(){var e=4022871197;return function(n){if(n){n=n.toString();for(var r=0;r<n.length;r++){var t=.02519603282416938*(e+=n.charCodeAt(r));t-=e=t>>>0,e=(t*=e)>>>0,e+=4294967296*(t-=e)}return 2.3283064365386963e-10*(e>>>0)}e=4022871197}}
