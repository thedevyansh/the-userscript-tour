# Google Summer of Code 2021 Final Work Product

| **Student** | Devyansh Chawla |
| --- | --- |
| **Organisation**  | [Wikimedia Foundation](https://wikimediafoundation.org/)  |
| **Project** | [Develop a Userscript/Gadget tutorial on mediaWiki.org](https://summerofcode.withgoogle.com/projects/#5542469837520896) |   

# The Userscript Tour
Userscripts are the JavaScript programs that provide Wikimedia users the ability to customize and change the behavior of their user accounts. This project is a guided adventure tour on `mediawiki.org` to give users insight on ***How to create a userscript on Wikimedia projects?***

# Table of contents
* [About the project](#about-the-project)
* [How to run it locally?](#how-to-run-it-locally)
* [Bug report](#bug-report)
* [Feature request](#feature-request)
* [License](#license)
* [Blog posts](#blog-posts)
* [Special note](#special-note)

# About the project

The Userscript Tour facilitates users to learn about userscripts and how they are created using ResourceLoader, MediaWiki Action API, and Object-Oriented User Interface, consistently. The workflow is carried out using four missions:

<p align="center"><img src="/demos/f1.png" alt="Landing page of The Userscript Tour" width="550"></p>

**Mission 1 (Let's begin the journey)**<br>
The users will gain practical knowledge of what userscripts/gadgets are and how the existing userscripts are loaded in common.js. They will be made to write a basic yet interesting userscript and import it into their common.js page.

**Userscripts involved:**

- **Invert.js:** Adds an Invert link to the top toolbar. It allows inverting the page color and the color of images.

- **zoom.js:** Adds two buttons (to zoom-in and zoom-out) on the right of the page heading.

<p align="center"><img src="/demos/f2.png" alt="Mission 1 starts" width="550"></p>

**Mission 2 (Developing with ResourceLoader)**<br>
In this mission, the users will gain practical knowledge of ResourceLoader and the core modules available.

**Userscripts involved:**

- **toggleFontColor.js:** Adds a link to the p-personal portlet area, which when clicked toggles the font color of the content. It is created to depict the use of mediawiki.util module.

- **userEditCount.js:** Shows the count of edits made by the logged-in user on the current wiki beside the username.

<p align="center"><img src="/demos/f3.png" alt="Mission 2 starts" width="550"></p>

**Mission 3 (Strengths of the Action API)**<br>
In this mission, the users will gain practical knowledge of MediaWiki Action API, endpoints, modules, submodules, parameters, and API Sandbox.

**Userscripts involved:**

- **basicPageInfo.js:** Shows the basic information about the current page (number of bytes/characters) at the top of the content area. This userscript is written to help users get started with making API calls to the Wikimedia servers.

- **quickChangeLog.js:** Adds a link to the Toolbox portlet area, that when clicked shows the 25 most recent changes on MediaWiki in the form of a jQuery dialog box.

<p align="center"><img src="/demos/f4.png" alt="Mission 3 starts" width="550"></p>

**Mission 4 (Novelty of OOUI)**<br>
In the final mission, the users will gain practical knowledge of Object-Oriented User Interface (OOUI), OOUI elements, widgets, dialogs, custom user interface, etc.

**Userscripts involved:**

- **showAlertBox.js:** Appends an OOUI button to the portlet area that when clicked, shows an OOUI Message Dialog (a simple alert box).

- **guessRandomNumber.js:** One of the cool userscripts which makes use of custom widgets. It prepends a tiny random game at the top of the wiki page. The OOUI widgets used are: MessageWidget, LabelWidget, TextInputWidget, ButtonWidget and Simple Message Dialog Box.

<p align="center"><img src="/demos/f5.png" alt="Mission 4 starts" width="550"></p>

<p align="center"><img src="/demos/f6.png" alt="Mission 4 ends" width="550"></p>

NOTE: The missions are constructed such that each one of them builds on the concepts introduced in the preceding missions.

**Other highlights**

- A welcome message is sent to the Talk page when the user initiates The Userscript Tour (Mission 1).

<p align="center"><img src="/demos/f7.png" alt="Welcome message on Talk page" width="550"></p>

- For further engagement, the user is awarded badges for small accomplishments; for example, a badge for loading the first userscript, another badge for completing a Mission, etc.

<p align="center"><img src="/demos/f8.png" alt="A badge awarded in Mission 1" width="550"></p>

- The badges are sent to a subpage of the user. The user consent is taken before writing anything to the pages of the User namespace.

<p align="center"><img src="/demos/f9.png" alt="All badges awarded in The Userscript Tour" width="550"></p>

**Code Example: Create a guider**
 
```javascript
tour.step( {
		name: '3',
		title: 'Put title here',
		description: 'Put description here',
		onShow: gt.parseDescription,
		overlay: true,
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

# Blog posts
All of my blog posts related to the project can be found [here](https://thedevyansh.github.io/google-summer-of-code-2021/).

# Special note
This project is created as part of Google Summer of Code 2021 with my mentoring organization being **Wikimedia Foundation.** Once deployed on [mediawiki.org](https://www.mediawiki.org/wiki/MediaWiki), I'll update the deployed link in the repository.

<p align="center"><img src="/demos/f10.png" alt="GSoC with WMF"></p>
