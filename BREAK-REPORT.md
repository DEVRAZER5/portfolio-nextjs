What I tried 

Submitted the contact form empty, with garbage text, and with emoji in every field. Submitted it twice fast. Opened the site in a browser I hadn't tested before. Clicked every link on every page. 


Fix-now 

Emoji in the email field got through and the message still sent. The browser was quietly converting the emoji into a punycode string (plain ASCII) before my validation code ever saw it, so my email check thought it looked fine. Fixed by switching the field from type="email" to type="text", so the browser stops rewriting the value and my own check actually validates what I typed. Retested, works now. 


Known limitation 

My four projects (Amazon Clone, YouTube Clone, JS Fundamentals, Logo Redesign) don't have demo or repo links, since I never pushed them to GitHub as their own repos. Not fixing this now, bigger job than this checkpoint, but it's a real gap. 


Findability and speed 

Added a proper page title, description, and social-share preview (there was only a bare title before). Lighthouse mobile performance: 94-99 across my pages. Searched my own name on Google: the site doesn't show up yet, it's new and likely hasn't been indexed yet  
