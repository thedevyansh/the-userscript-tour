# The Userscript Tour
Userscripts are the JavaScript programs that provide Wikimedia users the ability to customize and change the behavior of their user account. This project is a guided adventure tour on MediaWiki to give users insight on ***How to create a userscript on Wikimedia projects?***

# Table of contents
* [About the project](#about-the-project)
* [How to run it locally?](#how-to-run-it-locally)
* [License](#license)
* [Special note](#special-note)

# About the project
The Userscript Tour facilitates users to learn about userscripts and how they are created using ResourceLoader, MediaWiki Action API, and Object-Oriented User Interface, in a consistent manner. The workflow is carried out using four missions:

* **Mission 1 [Let's begin the journey]**<br>
The users will gain practical knowledge of what userscripts/gadgets are and how the existing user scripts are loaded in common.js. They will be made to write a basic yet interesting userscript and import it in their common.js page.

* **Mission 2 [Developing with ResourceLoader]**<br>
In this mission, the users will gain practical knowledge of ResourceLoader and the useful core modules available. 

* **Mission 3 [Strengths of the Action API]**<br>
In this mission, the users will gain practical knowledge of MediaWiki Action API, endpoints, modules, submodules, parameters, and API Sandbox.

* **Mission 4 [Novelty of OOUI]**<br>
In the final mission, the users will gain practical knowledge of Object-Oriented User Interface (OOUI), OOUI elements, widgets, dialogs, etc.

NOTE: The missions are constructed such that each one of them builds on its preceding missions in one or the other way.

![Landing interface](/demos/1.png)
<br>

![Mission 1 ends](/demos/2.png)
<br>

![Quick Changelog userscript](/demos/3.png)

**Code Example: Create a guider**
 
```javascript
tour.step( {
		name: '3',
		title: 'Put title here',
		description: 'Put description here',
		onShow: gt.parseDescription,
		overlay: false,
		closeOnClickOutside: false,
		buttons: [ {
			name: '<big>←</big>',
			action: 'externalLink',
			url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=2'
		}, {
			name: 'And gadgets?',
			action: 'next',
		} ],
		allowAutomaticOkay: false

	} )
	.next( '4' );
```
This would have result similar to following:

![A Mission 2 guider](/demos/4.png)

**Advantage of The Userscript Tour**<br>

The project primarily focuses on newbie developers and existing Wikimedia community members who have a little bit JavaScript knowledge. If someone does outreach then every participant should go in one and the same flow.

# How to run it locally?
**Prerequisites:**
* [MediaWiki](https://www.mediawiki.org/wiki/Manual:Installation_guide)
* Following extensions:
  * [EventLogging](https://www.mediawiki.org/wiki/Extension:EventLogging)
  * [EventStreamConfig](https://www.mediawiki.org/wiki/Extension:EventStreamConfig)
  * [EventBus](https://www.mediawiki.org/wiki/Extension:EventBus)
  * [GuidedTour](https://www.mediawiki.org/wiki/Extension:GuidedTour)
  * [ParserFunctions](https://www.mediawiki.org/wiki/Extension:ParserFunctions)
  * [Scribunto](https://www.mediawiki.org/wiki/Extension:Scribunto)
  * [TemplateStyles](https://www.mediawiki.org/wiki/Extension:TemplateStyles)

For MediaWiki installation, I have used the [MediaWiki-Docker](https://www.mediawiki.org/wiki/MediaWiki-Docker) for setting up my development environment.

1. Create the templates present in `Templates` directory and wikipages present in respective directories - `mission-1`, `mission-2`, `mission-3` and `mission-4`.
2. The naming of templates and wikipages should follow the convention: Replace the `-` (hyphen) delimiter with `/` (slash). For example, the name of the template **TUT-Background-1** should be **TUT/Background/1** on your local installation of MediaWiki.
3. Find the tour scripts in directories of respective missions above and create the following pages in the MediaWiki namespace:
	* MediaWiki:Guidedtour-tour-tut1.js
	* MediaWiki:Guidedtour-tour-tut2.js
	* MediaWiki:Guidedtour-tour-tut3.js
	* MediaWiki:Guidedtour-tour-tut4.js
4. Navigate to `/The_Userscript_Tour` on your local MediaWiki.

LIMITATIONS: 
* This tour only uses the Source Editor. If you use the Visual Editor or have it enabled it won't work yet.
* You need JavaScript enabled for the tour to work properly.
* The tour is not supported on tablets and smaller mobile devices.

# License
Distributed under the GPL-3.0 License. See `LICENSE` for more information.

# Special note
<div align="center"><img src="/demos/5.png" width="500" align="center" /></div>
<br>
This project is created as part of Google Summer of Code 2021 with my mentoring organisation being Wikimedia Foundation. I'm hopeful that this project would be deployed on mediawiki.org. Once done, I'll update this section.

