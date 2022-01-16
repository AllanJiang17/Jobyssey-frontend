document.addEventListener("DOMContentLoaded", ()=> {
    const add = document.querySelector(".add");
    const push = document.querySelector(".push");
    const displayDiv = document.querySelector(".display");
    const interviewDisplay = document.querySelector(".interviewDisplay");
    var selection = document.querySelector(".selection");
    const error = document.querySelector(".comp_error");

    const userApp = localStorage.getItem("application");
    const userInt = localStorage.getItem("interview");

    const userAppArr = userApp.split(", ");
    const userIntArr = userInt.split(", ");

    var total_app = userAppArr.length;
    var total_int = userIntArr.length;

    var apparr = [];

    
    fetch('https://jobysseyapi.herokuapp.com/api/v1/company/getCompany').then(response=>{
        return response.json();
    }).then(json=>{
        for (var i = 0; i < userAppArr.length; i++) {
            var str = userAppArr[i].toUpperCase();
            var aCount = 0;
            var iCount = 0;
            var name;
            for(var j = 0; j < json.length; j++) {
                var obj = json[j];
                name = obj.name;
                if (name != null) {
                    name = name.toUpperCase();
                    if (name.localeCompare(str) == 0) {
                        aCount = obj.applications;
                        iCount = obj.interviews;
                        break;
                    }
                }
            }

            if (name != null) {
                apparr.push(str);
                selection.style.display = 'none';
                add.innerHTML = "Add new application";

                const newDiv = document.createElement("div");
                const newComp = document.createElement("p");
                const numApp = document.createElement("p");
                const numInt = document.createElement("p");
                const interview = document.createElement("p");
                const buttons = document.createElement("div");
                const checkBtn = document.createElement("button");
                const crossBtn = document.createElement("button");
                

                newComp.innerHTML = str;
                numApp.innerHTML = "Number of Applications: ".concat(aCount);
                numInt.innerHTML = "Number of Interviews: ".concat(iCount);
                interview.innerHTML = "Interview?"

                
                buttons.appendChild(checkBtn);
                buttons.appendChild(crossBtn);
                newDiv.appendChild(newComp);
                newDiv.appendChild(numApp);
                newDiv.appendChild(numInt);
                newDiv.appendChild(interview);
                newDiv.appendChild(buttons);


                buttons.classList.add("buttons");
                checkBtn.classList.add("check");
                crossBtn.classList.add("cross");
                interview.classList.add("inter");
                newComp.classList.add("newComp");
                newDiv.classList.add('display-cell');

                
                const aCountID = str.concat("app");
                const iCountID = str.concat("int");

                numApp.setAttribute('id', aCountID);
                numInt.setAttribute('id', iCountID);

                checkBtn.setAttribute('id', str);
                crossBtn.setAttribute('id', str);

                const newDivAttr = str.concat("id");
                newDiv.setAttribute('id', newDivAttr);
                displayDiv.appendChild(newDiv);
            }
        }

        for(var i = 0; i < userIntArr.length; i++) {
            var str = userIntArr[i].toUpperCase();

            var num_application;
            var num_interview;
            var name;

            for(var j = 0; j < json.length; j++) {
                var obj = json[j];
                var name = obj.name;
                if (name != null) {
                    name = name.toUpperCase();
                    if (name.localeCompare(str) == 0) {
                        num_application = obj.applications;
                        num_interview = obj.interviews;
                        break;
                    }
                }
            }

            if (name != null) {
                const newDiv = document.createElement("div");
                const newComp = document.createElement("p");
                const numInt = document.createElement("p");
                const intchance = document.createElement("p");

                newComp.innerHTML = str;
                numInt.innerHTML = "Number of interviews: ".concat(num_interview);
                intchance.innerHTML = "Interview chance: ".concat(num_interview, " / ", num_application);

                newDiv.appendChild(newComp);
                newDiv.appendChild(numInt);
                newDiv.appendChild(intchance);

                newComp.classList.add("comp-name");
                newDiv.classList.add("interview-cell");
                interviewDisplay.appendChild(newDiv);
            }
        }
    })

    add.addEventListener('click', () => {
        if (selection.style.display === 'none') {
            selection.style.display = 'inline';
            error.style.display = 'none';
            add.innerHTML = "Cancel";
        } else {
            selection.style.display = 'none';
            add.innerHTML = "Add new application";
        }

    });

    push.addEventListener('click', () => {
        const comsel = document.querySelector(".cominput");
        const comp = comsel.value.toUpperCase();
        var appCount = 0;
        var interviewCount = 0;
        

        if (comp === "") {
            error.style.display = 'inline';
            error.innerHTML = "Company name cannot be empty";
            return;
        }


        const appCountID = comp.concat("app");
        const intCountID = comp.concat("int");

        fetch('https://jobysseyapi.herokuapp.com/api/v1/company/getCompany').then(response=>{
            return response.json();
        }).then(json=>{
            var exist = false;
            for(var i = 0; i < json.length; i++) {
                var obj = json[i];
                var name = obj.name;
                if (name != null) {
                    name = name.toUpperCase();
                    if (name.localeCompare(comp) == 0) {
                        exist = true;
                        appCount = obj.applications;
                        interviewCount = obj.interviews;
                        break;
                    }
                }
            }

            var displayed = false;

            if (exist) {
                var str = "https://jobysseyapi.herokuapp.com/api/v1/company/".concat(comp, "/0");
                fetch(str, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'}
                });
                for(var i = 0; i < apparr.length; i++) {
                    if (apparr[i].toUpperCase().localeCompare(comp) == 0) {
                        displayed = true;
                        const a = document.getElementById(appCountID);
                        a.innerHTML = "Number of Applications: ".concat(appCount + 1);
                        break;
                    }
                }
            } else {
                var str = "https://jobysseyapi.herokuapp.com/api/v1/company/company/";

                let data = {name: comp, applications: 1, interviews: 0};

                fetch(str, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                appCount = 1;
            }

            if (!displayed) {
                apparr.push(comp);
                selection.style.display = 'none';
                add.innerHTML = "Add new application";
        
                const newDiv = document.createElement("div");
                const newComp = document.createElement("p");
                const numApp = document.createElement("p");
                const numInt = document.createElement("p");
                const interview = document.createElement("p");
                const buttons = document.createElement("div");
                const checkBtn = document.createElement("button");
                const crossBtn = document.createElement("button");
                

                newComp.innerHTML = comp;
                numApp.innerHTML = "Number of Applications: ".concat(appCount);
                numInt.innerHTML = "Number of Interviews: ".concat(interviewCount);
                interview.innerHTML = "Interview?"
        
                
                buttons.appendChild(checkBtn);
                buttons.appendChild(crossBtn);
                newDiv.appendChild(newComp);
                newDiv.appendChild(numApp);
                newDiv.appendChild(numInt);
                newDiv.appendChild(interview);
                newDiv.appendChild(buttons);
        
        
                buttons.classList.add("buttons");
                checkBtn.classList.add("check");
                crossBtn.classList.add("cross");
                interview.classList.add("inter");
                newComp.classList.add("newComp");
                newDiv.classList.add('display-cell');

                numApp.setAttribute('id', appCountID);
                numInt.setAttribute('id', intCountID);

                checkBtn.setAttribute('id', comp);
                crossBtn.setAttribute('id', comp);

                const newDivAttr = comp.concat("id");
                newDiv.setAttribute('id', newDivAttr);
                displayDiv.appendChild(newDiv);
            }
        })

        
    });

    displayDiv.addEventListener('click',function(e){
        if(e.target && e.target.className == 'check'){
            var id = e.target.id.concat("id");
            const cell = document.getElementById(id);
            var str = "https://jobysseyapi.herokuapp.com/api/v1/company/".concat(e.target.id, "/1");
            fetch(str, {
                method: "POST",
                headers: {'Content-Type': 'application/json'}
            });

            const appid = e.target.id.concat("app");
            const intid = e.target.id.concat("int");


            const num_application = document.getElementById(appid).innerHTML.split(": ")[1];
            const num_interview = parseInt(document.getElementById(intid).innerHTML.split(": ")[1]) + 1;

            const newDiv = document.createElement("div");
            const newComp = document.createElement("p");
            const numInt = document.createElement("p");
            const intchance = document.createElement("p");

            newComp.innerHTML = e.target.id;
            numInt.innerHTML = "Number of interviews: ".concat(num_interview);
            intchance.innerHTML = "Interview chance: ".concat(num_interview, " / ", num_application);

            newDiv.appendChild(newComp);
            newDiv.appendChild(numInt);
            newDiv.appendChild(intchance);

            newComp.classList.add("comp-name");
            newDiv.classList.add("interview-cell");
            interviewDisplay.appendChild(newDiv);

            cell.remove();
        } else if (e.target && e.target.className == 'cross') {
            var id = e.target.id.concat("id");
            const cell = document.getElementById(id);
            const index = apparr.indexOf(e.target.id);
            if (index > -1) {
                apparr.splice(index, 1);
            }

            cell.remove();
        }
    });

});
