(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[6],{159:function(t,n,e){"use strict";e.d(n,"a",(function(){return o}));var r=e(73);function o(t,n){return function(t){if(Array.isArray(t))return t}(t)||function(t,n){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t)){var e=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(e.push(a.value),!n||e.length!==n);r=!0);}catch(c){o=!0,i=c}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return e}}(t,n)||Object(r.a)(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},225:function(t,n,e){"use strict";e.r(n);var r=e(159),o=e(0),i=e.n(o),a=e(25),u=e(69);n.default=function(t){var n=t.history,e=t.location,o=Object(u.x)({onCompleted:function(t){a.a.set(t.tokens),n.push("/me")},onError:function(){n.push("/login")}}),c=Object(r.a)(o,1)[0];return i.a.useEffect((function(){var t=Object(a.g)(e).token;c({variables:{secret:t}})}),[c]),null}}}]);