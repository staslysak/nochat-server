(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[8],{222:function(e,t,a){"use strict";a.r(t);var n=a(28),r=a.n(n),i=a(38),o=a(65),c=a(32),s=a(159),u=a(1),l=a.n(u),m=a(227),h=a(228),p=a(150),f=a(223),d=a(224),b=a(67),v=a(66),g=a(148),E=a(70),w=a(24),x=Object(g.a)((function(e){return{Login:{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",height:"100vh",width:"100vw"}}}));t.default=function(e){var t=x(),a=l.a.useState({}),n=Object(s.a)(a,2),u=n[0],g=n[1],j=l.a.useState({}),y=Object(s.a)(j,2),O=y[0],L=y[1],k=Object(b.u)(),C=Object(s.a)(k,1)[0],W=Object(b.r)(),J=Object(s.a)(W,1)[0],Q=/\/registration/.test(e.location.pathname),S=function(e){var t=e.target,a=t.name,n=t.value;g((function(e){return Object(c.a)({},e,Object(o.a)({},a,n))}))},T=function(){var t=Object(i.a)(r.a.mark((function t(a){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:Q?e.history.push("/login"):(w.a.set(a),e.history.push("/me")),L({});case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),B=function(){var e=Object(i.a)(r.a.mark((function e(t){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),!Q){e.next=6;break}return e.next=4,C({variables:u}).then((function(e){var t=e.data;return T(t.register)})).then((function(){return alert("Check your email")})).catch((function(e){e.graphQLErrors&&e.graphQLErrors.forEach((function(e){return L(e.extensions.validationErrors)}))}));case 4:e.next=8;break;case 6:return e.next=8,J({variables:u}).then((function(e){var t=e.data;T(t.login),E.b.subscriptionClient.tryReconnect()})).catch((function(e){e.graphQLErrors&&e.graphQLErrors.forEach((function(e){return L(e.extensions.validationErrors)}))}));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return l.a.createElement("div",{className:t.Login},l.a.createElement(h.a,{maxWidth:300},l.a.createElement(p.a,{variant:"h6",gutterBottom:!0},Q?"Join":"Login"),l.a.createElement("form",{onSubmit:B},l.a.createElement("div",null,l.a.createElement(m.a,{fullWidth:!0,margin:"dense",variant:"outlined",onChange:S,value:u.username,label:"Username",name:"username",error:O.username,helperText:O.username}),Q&&l.a.createElement(m.a,{fullWidth:!0,margin:"dense",variant:"outlined",onChange:S,value:u.email,label:"Email",name:"email",error:O.email,helperText:O.email}),l.a.createElement(m.a,{fullWidth:!0,margin:"dense",variant:"outlined",onChange:S,value:u.password,label:"Password",name:"password",type:"password",error:O.password,helperText:O.password})),l.a.createElement(p.a,{align:"center",variant:"body2",gutterBottom:!0},Q?l.a.createElement(f.a,{align:"center",component:v.b,to:"/"},"Already have an account?"):l.a.createElement(f.a,{align:"center",component:v.b,to:"/registration"},"Not a member?")),l.a.createElement(d.a,{type:"submit",fullWidth:!0},Q?"Join":"Login"))))}}}]);
//# sourceMappingURL=8.4a8416e7.chunk.js.map