/*  Bailie Delpire
	Csc 337, Spring 2019
	Final Project, calendar.js

	This file is the script for calendar.html */

"use strict";

(function() {

	let today = new Date();
	let day = String(today.getDate()).padStart(2, '0');
	let month = String(today.getMonth() + 1).padStart(2, '0');
	let year = today.getFullYear();
	let viewMonth = parseInt(month);
	let name = "";

	window.onload = function() {
		let json = getInfo();
		for (let i = 1; i < 13; i++) {
			createMonths(json, i);
		}
		showMonth(viewMonth);
		document.getElementById("<").onclick = back;
		document.getElementById(">").onclick = forward;
		document.getElementById("today").onclick = thisMonth;
		document.getElementById("submit").onclick = send;
		fetchEvents();
	}

	/* Creates json info for the length and start days of each month. */
	function getInfo() {
		let months = [];
		months.push({month: "1", name: "January", startDay: "2", numDays: "31"});
		months.push({month: "2", name: "February", startDay: "5", numDays: "28"});
		months.push({month: "3", name: "March", startDay: "5", numDays: "31"});
		months.push({month: "4", name: "April", startDay: "1", numDays: "30"});
		months.push({month: "5", name: "May", startDay: "3", numDays: "31"});
		months.push({month: "6", name: "June", startDay: "6", numDays: "30"});
		months.push({month: "7", name: "July", startDay: "1", numDays: "31"});
		months.push({month: "8", name: "August", startDay: "4", numDays: "31"});
		months.push({month: "9", name: "September", startDay: "0", numDays: "30"});
		months.push({month: "10", name: "October", startDay: "2", numDays: "31"});
		months.push({month: "11", name: "November", startDay: "5", numDays: "30"});
		months.push({month: "12", name: "December", startDay: "0", numDays: "31"});
		let json = {months: months};
		return json;
	}

	/* Makes the display of the argument month visible and the display
		of any other months not visible. Adds the month name to the page. */
	function showMonth(month) {
		let months = calendar.querySelectorAll(".days");
		for (let i = 0; i < months.length; i++) {
			let name = months[i].name;
			if (months[i].id != month) {
				months[i].style.display = "none";
			} else {
				months[i].style.display = "grid";
				let div = document.getElementById("month");
				div.innerHTML = name;
			}
		}
	}

	/* Changes the viewed month to the previous month. */
	function back() {
		document.getElementById(">").disabled = false;
		viewMonth -= 1;
		showMonth(viewMonth);
		if (viewMonth == 1) {
			document.getElementById("<").disabled = true;
		}
	}

	/* Changes the viewed month to the next month. */
	function forward() {
		document.getElementById("<").disabled = false;
		viewMonth += 1;
		showMonth(viewMonth);
		if (viewMonth == 12) {
			document.getElementById(">").disabled = true;
		}
	}

	/* Changes the viewd month to the current month. */
	function thisMonth() {
		document.getElementById("<").disabled = false;
		document.getElementById(">").disabled = false;
		viewMonth = parseInt(month);
		showMonth(viewMonth);
	}

	/* Returns the value of the checked radio button. */
	function getVal(name) {
		let list = document.getElementsByName(name);
		for (let i = 0; i < list.length; i++) {
			if (list[i].checked) {
				return list[i].value;
			}
		}
	}

	/* Returns whether the given string is composed of digits. */
	function isDigit(str) {
    	return str && !/[^\d]/.test(str);
	}

	/* Gets all user input from the page's inputs. Checks whether input
		is valid before sumbitting a post. */
	function send() {
		let type = getVal("type");
		let date = document.getElementById("date").value;
		let hour = document.getElementById("hour").value;
		let minute = document.getElementById("minute").value;
		let ampm = getVal("time");
		let time = hour + ":" + minute + " " + ampm;
		let title = document.getElementById("title").value;
		let details = document.getElementById("details").value;
		// Validate user input: only the time has restrictions.
		if (isDigit(hour) == true && isDigit(minute) == true) {
			submit(type, date, time, title, details);
		}
	}

	/* Builds json out of the arguments and submits a post. */
	function submit(type, date, time, title, details) {
		const event = {type : type, date: date,
			time: time, title: title, details: details};

		const fetchOptions = {
			method: 'Post',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify(event)
		};

		let url = "http://localhost:3000";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				console.log(responseText);
			})
			.catch(function(error) {
				console.log(error);
			});
		fetchEvents();
	}

	/* Stores an element's class name in a global variable and adds
		'hover' to the classname. */
	function hover() {
		name = this.className;
		this.className += " hover";
	}

	/* Sets the classname of an element to the global variable 'name'. */
	function noHover(day) {
		this.className = name;
	}

	/* If a checkbox is clicked, submits a post for a 'clear' event and
		then either a 'checked' event or a 'todo' event, so that the calendar
		can keep track of whether or a to do box is checked or unchecked. */
	function check() {
		let name = this.name.split("//");
		if (this.getAttribute("checked") != "checked") {
			submit("clear", name[0], "", name[1], name[2]);
			submit("checked", name[0], "", name[1], name[2]);
		} else {
			submit("clear", name[0], "", name[1], name[2]);
			submit("todo", name[0], "", name[1], name[2]);
		}
	}

	/* Adds an element to a day's info box depending on the type of event selected.
		Events are added as a regular div, ToDo's are added as a checkbox in a div,
		and Clear removes the div with the same event name. */
	function add(event, monthNum, date, type, details) {
		let months = calendar.querySelectorAll(".days");
		for (let i = 0; i < months.length; i++) {
			if (months[i].id == monthNum) {
				let days = months[i].querySelectorAll(".pastDay, .today, .day");
				for (let j = 0; j < days.length; j++) {
					if (days[j].name == date) {
						let day = days[j].querySelector(".info");
						if (type == "event") {
							let div = document.createElement("div");
							div.innerHTML = event;
							div.name = details;
							div.onclick = showDetails;
							day.appendChild(div);
						} else if (type == "todo" || type == "checked") {
							let div =  document.createElement("div");
							let checkbox = document.createElement("INPUT");
							checkbox.name = "2019-" + monthNum + "-" + date + "//" + event + "//" + details;
							checkbox.onclick = check;
							checkbox.setAttribute("type", "checkbox");
							if (type == "checked") {
								checkbox.setAttribute("checked", "checked");
							}
							let label = document.createElement("label");
							label.innerHTML = event;
							div.appendChild(checkbox);
							div.appendChild(label);
							day.appendChild(div);
						} if (type == "clear") {
							for (let i = 0; i < day.childNodes.length; i++) {
								if (day.childNodes[i].innerHTML == event) {
									day.removeChild(day.childNodes[i]);
								} if (day.childNodes[i].childNodes.length > 1 && day.childNodes[i].childNodes[1].innerHTML == event) {
									day.removeChild(day.childNodes[i]);
								}
							}
						}
					}
				}
			}
		}
	}

	/* Adds an event's details to the 'Event Details' section. */
	function showDetails() {
		let event = document.getElementById("eventDetails");
		event.innerHTML = "";
		let p1 = document.createElement("p");
		p1.innerHTML = this.name.title;
		let p2 = document.createElement("p");
		p2.innerHTML = "Date: " + this.name.date;
		let p3 = document.createElement("p");
		p3.innerHTML = "Time: " + this.name.time;
		let p4 = document.createElement("p");
		p4.innerHTML = "Details: " + this.name.details;
		event.appendChild(p1);
		event.appendChild(p2);
		event.appendChild(p3);
		event.appendChild(p4);
	}

	/* Using json which stores info about each month, adds every month's
		calendar view to the page by adding all of its days as divs. */
	function createMonths(json, month) {
		let calendar = document.getElementById("calendar");
			
		// Create a div for the month.
		let monthDiv = document.createElement("div");
		monthDiv.className = "days";

		// Get info for the month.
		let months = json.months;
		let currMonth = months[month - 1];
		let startDay = parseInt(currMonth["startDay"]);
		let numDays = parseInt(currMonth["numDays"]);
		monthDiv.name = "2019 " + currMonth["name"];
		monthDiv.id = currMonth["month"];

		// Add preceding non-month days.
		for (let i = 0; i < startDay; i++) {
			let div = document.createElement("div");
			monthDiv.appendChild(div);
		}
		// Add month days.
		for (let i = startDay; i < numDays + startDay; i++) {
			let div = document.createElement("div");
			let num = document.createElement("div");
			let info = document.createElement("div");
			num.className = "num";
			info.className = "info";
			num.innerHTML = i - startDay + 1;
			div.name = i - startDay + 1;
			div.appendChild(num);
			div.appendChild(info);
			div.onmouseover = hover;
			div.onmouseout = noHover;
			if (((i + startDay - 1) < day && viewMonth == month) || viewMonth > month) {
				div.className = "pastDay";
			} else if ((i + startDay - 1) == day && viewMonth == month) {
				div.className = "today";
				num.className = "numToday";
			} else {
				div.className = "day";
			}
			monthDiv.appendChild(div);
		}
		calendar.appendChild(monthDiv);
	}

	/* Uses a fetch to get info from a file to add events to the page. */
	function fetchEvents() {
		let url = "http://bailiecd-calendar.herokuapp.com:process.env.PORT";
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				// Clear all days.
				let months = calendar.querySelectorAll(".days");
				for (let i = 0; i < months.length; i++) {
					let days = months[i].querySelectorAll(".pastDay, .today, .day");
					for (let j = 0; j < days.length; j++) {
						let day = days[j].querySelector(".info");
						day.innerHTML = "";
					}
				}

				// Add any info received from the fetch.
				let json = JSON.parse(responseText);
				let events = json.events;
				for (let i = 0; i < events.length - 1; i++) {
					let date = events[i].date.split("-");
					let day = parseInt(date[2]) + "";
					let month = parseInt(date[1]) + "";
					let title = events[i].title;
					let type = events[i].type;
					add(title, month, day, type, events[i]);
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	}


	/** Checks the status of the fetch. **/
	function checkStatus(response) {
	    if (response.status >= 200 && response.status < 300) {
	        return response.text();
	    } else if (response.status == 404) {
	    	return Promise.reject(new Error("Sorry, we couldn't find that page"));
	    } else {
	        return Promise.reject(new Error(response.status+": "+response.statusText));
	    }
	}


})();
