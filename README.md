# The Userscript Tour
Userscripts are the JavaScript programs that provide Wikimedia users the ability to customize and change the behavior of their user accounts. This project is a guided adventure tour on `mediawiki.org` to give users insight on ***How to create a userscript on Wikimedia projects?***

# Table of contents
* [About the project](#about-the-project)
* [How to run it locally?](#how-to-run-it-locally)
* [Bug report](#bug-report)
* [Feature request](#feature-request)
* [License](#license)
* [Special note](#special-note)

# About the project
The Userscript Tour facilitates users to learn about userscripts and how they are created using ResourceLoader, MediaWiki Action API, and Object-Oriented User Interface, consistently. The workflow is carried out using four missions:

* **Mission 1 (Let's begin the journey)**<br>
The users will gain practical knowledge of what userscripts/gadgets are and how the existing user scripts are loaded in common.js. They will be made to write a basic yet interesting userscript and import it into their common.js page.

* **Mission 2 (Developing with ResourceLoader)**<br>
In this mission, the users will gain practical knowledge of ResourceLoader and the useful core modules available. 

* **Mission 3 (Strengths of the Action API)**<br>
In this mission, the users will gain practical knowledge of MediaWiki Action API, endpoints, modules, submodules, parameters, and API Sandbox.

* **Mission 4 (Novelty of OOUI)**<br>
In the final mission, the users will gain practical knowledge of Object-Oriented User Interface (OOUI), OOUI elements, widgets, dialogs, custom user interface, etc.

NOTE: The missions are constructed such that each one of them builds on the concepts introduced in the preceding missions.

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
			name: 'Button 1',
			action: 'externalLink',
			url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=2'
		}, {
			name: 'Button 2',
			action: 'next',
		} ],
		allowAutomaticOkay: false

	} )
	.next( '4' );
```
This would have a result similar to the following:

![A Mission 2 guider](/demos/4.png)

**Benefit of The Userscript Tour**<br>

The project primarily focuses on newbie developers and existing Wikimedia community members who have a little bit of JavaScript knowledge. If someone does outreach then every participant would go in the same flow.

# How to run it locally?
**Prerequisites:**
* [MediaWiki](https://www.mediawiki.org/wiki/Manual:Installation_guide) (>= 1.35.0)
* Following extensions:
  * [EventBus](https://www.mediawiki.org/wiki/Extension:EventBus)
  * [EventLogging](https://www.mediawiki.org/wiki/Extension:EventLogging)
  * [EventStreamConfig](https://www.mediawiki.org/wiki/Extension:EventStreamConfig)
  * [GuidedTour](https://www.mediawiki.org/wiki/Extension:GuidedTour)
  * [ParserFunctions](https://www.mediawiki.org/wiki/Extension:ParserFunctions)
  * [Scribunto](https://www.mediawiki.org/wiki/Extension:Scribunto)
  * [TemplateStyles](https://www.mediawiki.org/wiki/Extension:TemplateStyles)

I used the [MediaWiki-Docker](https://www.mediawiki.org/wiki/MediaWiki-Docker) for setting up my development environment.

1. Enable JavaScript on your MediaWiki by appending `$wgAllowUserJs = true;` to the LocalSettings.php file.
2. Create the templates present in the `Templates` directory and the wiki pages present in respective directories - `mission-1`, `mission-2`, `mission-3`, and `mission-4`.
3. The naming of templates and wiki pages should follow the convention: Replace the `-` (hyphen) delimiter with `/` (slash). For example, the template **TUT-Background-1** should be named **TUT/Background/1** on your local installation of MediaWiki.
4. The media files used in the guided tour are uploaded on [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page). You can download them first and upload them on your wiki.
5. Register a new account on your wiki (**User:Novusistic**) and create subpages under it for userscripts present in the `userscripts` directory of the respective missions. 
6. Find the tour scripts in directories of respective missions and create the following pages in the MediaWiki namespace:
	* MediaWiki:Guidedtour-tour-tut1.js
	* MediaWiki:Guidedtour-tour-tut2.js
	* MediaWiki:Guidedtour-tour-tut3.js
	* MediaWiki:Guidedtour-tour-tut4.js
7. Navigate to `/The_Userscript_Tour` on your MediaWiki.

LIMITATIONS: 
* This tour only uses the Source Editor. If you use the Visual Editor or have it enabled it won't work yet.
* You need JavaScript enabled for the tour to work properly.
* The tour is not supported on tablets and smaller mobile devices.

# Bug report
Feel free to [open an issue](https://github.com/thedevyansh/the-userscript-tour/issues) if you find any bug.

# Feature request
Feel free to [open an issue](https://github.com/thedevyansh/the-userscript-tour/issues) to request any additional features you might need for your use case.

# License
Distributed under the GPL-3.0 License. See `LICENSE` for more information.

# Special note
This project is created as part of Google Summer of Code 2021 with my mentoring organization being **Wikimedia Foundation.** Once deployed on [mediawiki.org](https://www.mediawiki.org/wiki/MediaWiki), I'll update the deployed link in the repository.

<p align="center"><img src="/demos/5.png"></p>
