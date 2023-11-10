//Allow multiple word inputs, split them and run each sequentially
//Create empty rows after each normal row in which extras content will be displayed in accordion style

function stripe() {
    //console.log("STRIPE");
    let tab = document.getElementById("alltable");
    let all_rows = tab.getElementsByTagName("tr");
    // select all rows which are not hidden
    rows = [];
    for (let i=0; i<all_rows.length; i++) {
        if (all_rows[i].style.display!=='none') {
            rows.push(all_rows[i]);
        }
    }
    //console.log(rows)

    // add a class for every second such row
    for(var x = 1; x < rows.length; x++) {  // https://stackoverflow.com/questions/42267771/alternating-table-row-color-robust-to-displaynone-settings
        if (!(x % 2 == 0)) { rows[x].classList.add('alt'); }
        else { rows[x].classList.remove('alt'); }
    }
}

function set_timer() {// https://bobbyhadz.com/blog/detect-when-user-stops-typing-in-javascript
    let timer;

    const waitTime = 500;

    const messageInput = document.getElementById('inputbar');

    messageInput.addEventListener('keyup', event => {
    document.getElementById("load").style.display = "inline-block";
    clearTimeout(timer);

    timer = setTimeout(() => {
        tablefilter();
    }, waitTime);
    });
}

function get_rows() {
    let table = document.getElementById("alltable");
    let rows = table.getElementsByTagName("tr");
    var count = 0;
    for(let i=0; i<rows.length; i++) {
        td = rows[i].getElementsByTagName("td")[0];
        //console.log(td)
        if (td) {
            //let val = td.innerText || td.innerHTML
            if (rows[i].style.display === "") {
                count+=1;
            } 
        }
    }
    return "<h5 style='margin:0;'>Entries found: " + count + "</h5>";
}
function reset_filtertable() {
    document.getElementById("all").innerHTML = table2;
    table = document.getElementById("alltable");
}

function reset() {
    inputbar.value = '';
    for (let i=0; i<active_filters.length; i++) {
        if (active_filters[i].toString()!==[''].toString()) {
            for (let j=0; j<active_filters[i].length; j++) {
                let key = filter_names[i],
                    value = active_filters[i][j];
                let id = key+"_"+value;
                document.getElementById(id).remove();
            }
        }
    }
    active_filters = [[''],[''],['']];
    reset_filtertable(); //getData();
    document.getElementById("entires").innerHTML = get_rows();  
    add_extras();
    stripe();
}

function add_extras() {
    for (let i = 0; i < acc.length; i++) { //https://www.w3schools.com/howto/howto_js_accordion.asp
        acc[i].addEventListener("click", function() {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("active");

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                this.innerText = "See more";
                } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                this.innerText = "See less";
            }
        });
        }
}

getData();

async function getData() {
    try {
        const url = "senators.json";
        const promise = await fetch(url);

        // Check if the request was successful
        if (!promise.ok) {
            throw new Error(
                `HTTP error! status: ${promise.status}`
            );
        }

        const data = await promise.json();

        displayJSON(data);
    } catch (error) {
        document.getElementById("id01").innerText = error;
    }
}

var table1 = "<table id='titletable'> <tr> <th>Title</th> <th></th> <th>Name</th> <th>Surname</th> <th>Party</th> </tr>"
            , table2 = "<table id='alltable'> <tr> <th>Name</th> <th>Surname</th> <th>Party</th> <th>State</th> <th>Gender</th> <th>Rank</th> <th>Additional Information</th> </tr>"
            //, extratable = "<table id='extratable'> <tr> <th>Office</th> <th>Date of birth</th> <th>Start Date</th> <th>Twitter ID</th> <th>Youtube ID</th> <th>Link</th> </tr>"
            , t_democrat =""
            , democrat = ""
            , t_republican =""
            , republican = ""
            , t_independent = ""
            , independent = ""
            , no_democrat = 0
            , no_republican = 0
            , no_independent = 0
            , all_democrat = ""
            , all_republican = ""
            , all_independent = ""
            , all_democrat_ext = ""
            , all_republican_ext = ""
            , all_independent_ext = ""
            , partys = []
            , states = []
            , ranks = []
            , head_names = []
            , table
            , temp_table
            , acc;

function displayJSON(obj) {

        var array = obj.objects;

            // table += "<tr><th>Type</th><th>Number</th></tr>";
        for (let i = 0; i < array.length; i++) {
            var name = array[i].person.firstname
                , surname = array[i].person.lastname
                , party = array[i].party
                , state = array[i].state
                , gender = array[i].person.gender
                , rank = array[i].senator_rank_label
                , office = array[i].extra.office
                , dob = array[i].person.birthday
                , start = array[i].startdate
                , twitter = array[i].person.twitterid
                , youtube = array[i].person.youtubeid
                , link = array[i].website;

            if (youtube === null){
                youtube = "N/A";
            }
            if (twitter === null){
                twitter = "N/A";
            }

            function lists(col,val) {
                eval('if (!'+col+'s.includes("'+val+'")) {'+col+'s.push("'+val+'")}');
            }
            
            lists('party',party);
            lists('rank',rank);
            lists('state',state);

            var title = '';

            let roles = [name,surname,party];
            let details = [name,surname,party,state,gender,rank];
            let extras = ["<b>Office: </b><br>"+office,"<b>DOB: </b><br>"+dob,"<b>Started: </b><br>"+start,"<b>Twitter: </b><br>"+twitter,"<b>Youtube: </b><br>"+youtube,"<b> Website: </b><br><a target='_blank' href='" + link + "''>" + link + "</a>"];

            function tabrow(roles,extras='none') {
                if (extras!='none') {
                    return "<tr> <td>"+roles.join('</td><td>')+"</td> <td> <button class='accordion'> See more </button> <div class='panel'> <p>"+extras.join('<br>')+"</p> </div> </td> </tr>";
                }
                else {
                    return "<tr> <td>"+roles.join('</td><td>')+"</td> </tr>";
                }
        }
            function sortrows(party) {
                if (array[i].leadership_title !== null) {
                    title = array[i].leadership_title;
                    roles.unshift(title,":");
                    eval("t_"+party+" += tabrow(roles)");
                } else {
                    eval(party+" += tabrow(roles)");
                }
                eval("no_"+party+" += 1");
                eval("all_"+party+" += tabrow(details,extras)");
                //eval("all_"+party+"_ext"+" += tabrow(extras)");
            }

            if (party === "Democrat") {
                sortrows("democrat");
            } else if (party === "Republican") {
                sortrows("republican");
            } else {
                sortrows("independent");
            }

        }

        table1 += t_democrat + t_republican + t_independent + "</table>";/*+ "<br> -Untitled- <br>" + democrat + republican*/
        table2 +=  all_democrat + all_republican + all_independent + "</table>";
        //extratable += all_democrat_ext + all_republican_ext + all_independent_ext + "</table>"

        document.getElementById("dems").innerHTML = "No of Democrats: " + no_democrat;
        document.getElementById("reps").innerHTML = "No of Republicans: " + no_republican;
        document.getElementById("indep").innerHTML = "No of Independent: " + no_independent;
        document.getElementById("id01").innerHTML = table1;
        document.getElementById("all").innerHTML = table2;
        //document.getElementById("extras").innerHTML = extratable;

        //console.log(partys)
        const searching = ['partys','ranks','states'];
        for(let i=0; i<searching.length; i++) {
            builddrops(searching[i]);
        }
        
        function builddrops(drops) {
            var filter = drops; //partys
            //console.log(filter)
            var filter_name = filter.slice(0, -1); //party
            var filter_name_caps = filter_name.charAt(0).toUpperCase() + filter_name.slice(1);
            var filter_list = eval(filter).sort();
            var filter_drop = "<button class='dropbtn' id='"+filter_name+"_button'>"+filter_name_caps+"</button> <div class='drop_content'>";
            var filter_div = "<div class='key_divs' id="+filter_name+"_div> <b style='color:black;display:flex; justify-content:left; margin-bottom:8px;'>"+filter_name_caps+"</b> </div>";
            
            for(let j=0; j<filter_list.length;j++) {
                //console.log(filter_list[j])
                filter_drop += "<a onclick='multi_col(`"+filter_name_caps+"`,`"+filter_list[j]+"`)'>"+filter_list[j]+"</a>";
            }

            filter_drop += "</div> </div>";
            //console.log('document.getElementById("drop_'+filter_name+').innerHTML ="'+ filter_drop + '"')
            eval('document.getElementById("drop_'+filter_name+'").innerHTML = "'+ filter_drop + '"');
            eval('document.getElementById("active_filters").innerHTML +="'+filter_div+'"');
            console.log("Finished reloading the table");
        }

        table = document.getElementById("alltable"); //.innerHTML //asynchoronous bs fix it
        let rows = table.getElementsByTagName("tr");
        let heads = rows[0].getElementsByTagName("th");
        for(let i=0; i<heads.length; i++) {
            head_names.push(heads[i].innerText);
        }
        document.getElementById("entires").innerHTML = get_rows();

        acc = document.getElementsByClassName("accordion");
        
        var root = document.querySelector(':root');
        let width = document.getElementById('inputbar').offsetWidth;
        let tbl = document.getElementById('alltable').rows
        let height = tbl[1].offsetHeight
        let update = width+"px";
        let update2 = height+"px"
        root.style.setProperty('--width', update);
        root.style.setProperty('--height', update2);


        add_extras();
        set_timer();
        stripe();
        

    }

var active_filters = [[""],[""],[""]];

//async function reload_table() {
//    await getData();
//    console.log("Table reloaded")
//}

/*
async function run_active_filters() {
    console.log("Reloading the table")
    reset_filtertable();
    console.log("Current active filters",active_filters)
    console.log("Individually running them")
    console.log("Activate filter length",active_filters.length)
    for (let i=0; i<active_filters.length; i++) {
        console.log("Running",active_filters[i][0],active_filters[i][1])
        await searchtable(active_filters[i][0],active_filters[i][1]);
    }
    console.log("Finished reloading filters")
}*/

async function tablefilter() {
    console.log("Reloading data");
    await multi_col();//await run_active_filters();
    console.log("Reloaded. Now searching");

    var heads,
        search,
        //table,
        rows;
    
    //if (keyword!="") {
    //    search = keyword.toUpperCase();
    //} else {
    //    search = document.getElementById("inputbar").value.toUpperCase();
    //}
    search = inputbar.value.toUpperCase();

    table = document.getElementById("alltable");
    rows = table.getElementsByTagName("tr");
    heads = rows[0].getElementsByTagName("th");

    var head_names = [];
    for(let i=0; i<heads.length; i++) {
        head_names.push(heads[i].innerText);
    }
    //let index = head_names.indexOf(col);

    var keep = [];
    for(let j=0; j<head_names.length; j++) {
        for(let i=0; i<rows.length; i++) {
            td = rows[i].getElementsByTagName("td")[j];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(search) > -1 && rows[i].style.display !== "none") {
                    keep.push(rows[i]);}
                if (j===head_names.length -1) {rows[i].style.display = "none"; }
                }
            }
    } 
    for(let i=0;i<keep.length;i++) {
        keep[i].style.display = "";
    }
    document.getElementById("entires").innerHTML = get_rows();
    document.getElementById("load").style.display = "none";
    stripe();
}
/*
function searchtable(key,val) { //'State','NZ'
    console.log("Now loading filter",key, val)
    //console.log('fired')
    var heads,
        search,
        table,
        row,
        ind;
    
    search = val.toUpperCase();
    //console.log(search)
    //console.log(key)

    table = document.getElementById("alltable");
    rows = table.getElementsByTagName("tr");
    heads = rows[0].getElementsByTagName("th");

    var head_names = [];
    for(let i=0; i<heads.length; i++) {
        head_names.push(heads[i].innerText);
    }

    var ind = head_names.indexOf(key)

    for(let i=0; i<rows.length; i++) {
        td = rows[i].getElementsByTagName("td")[ind];
        //console.log(td)
        if (td) {
            //let val = td.innerText || td.innerHTML
            if (td.innerHTML.toUpperCase().indexOf(search) > -1 && rows[i].style.display !== "none") {
                rows[i].style.display = "";
            } else { 
                rows[i].style.display = "none"; 
            }
        }
    }

    var check = 0

    for (let i = 0; i<active_filters.length; i++) {
        if (active_filters[i].toString() === [key,val].toString()) {
            var check = 1
        }
    }

    if (check === 0) {
    active_filters.push([key,val])
    var id = key+"_"+val
    var element = document.getElementById(id)
    if (element === null) {
        console.log('<button id='+key+'_'+val+' onclick="remove_filter(`'+key+'`,`'+val+'`)">Remove:'+key+'='+val+'</button>')
        let add_button = '<button id='+key+'_'+val+' onclick="remove_filter(`'+key+'`,`'+val+'`)">Remove:'+key+'='+val+'</button>'
        document.getElementById("active_filters").innerHTML += add_button
        console.log("Finishing loading",key,val) 
    }
    }
}

function remove_filter(key,val) {
    console.log("Old:",active_filters)
    var id = key+"_"+val
    document.getElementById(id).remove();
    let iter = active_filters.length
    let i = 0
    var new_filt = []
    while (i<iter) {
        console.log("Loop",i,"iter",iter)
        console.log(active_filters)
        if (active_filters[i].toString() === [key,val].toString()) {
            //active_filters.splice(i,1);
            console.log("Dropping:",[key,val])
        } else {
            console.log("Pushing:",active_filters[i])
            new_filt.push(active_filters[i])
        }
        i+=1
    }
    console.log(new_filt)
    active_filters = new_filt
    console.log("New:",active_filters)
    tablefilter(); 

}*/


function cartesian(...args) { //Stole from stack exchange: https://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements
    var r = [], max = args.length-1;
    function helper(arr, i) {
        for (var j=0, l=args[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}


const filter_names = ['Party','Rank','State'];
//active_filters = [['Republican','Independent'],['Junior','Senior'],['AK','AZ']];  // [Party,Rank,State], default ['','','']

function multi_col(key=0,value=0) {
    if (key!==0 && value!==0) {
        var check = 0;
        let key_array = filter_names.indexOf(key);

        if (active_filters[key_array].toString() == [''].toString()) {
            active_filters[key_array] = [];
        } else {
            for (let i = 0; i<active_filters[key_array].length; i++) {
                if (active_filters[key_array][i].toString() === value) {
                    check = 1;
                }
            }
        }

        if (check === 0) {
            active_filters[key_array].push(value);
            var id = key+"_"+value;
            var element = document.getElementById(id);
            if (element === null) {
                console.log('<button id='+key+'_'+value+' onclick="remove_filter(`'+key+'`,`'+value+'`)"><span style="color:lightgrey;">x</span> '+value+'</button>');
                let add_button = '<button id='+key+'_'+value+' onclick="remove_filter(`'+key+'`,`'+value+'`)"><p style="color:grey; float:left; margin:0;">x</p> <p style="float:center; margin:0;">'+value+'</p></button>';
                let div = key.toLowerCase()+"_div";
                console.log('document.getElementById('+div+').innerHTML += add_button');
                document.getElementById(div).innerHTML += add_button;
                console.log("Finishing loading",key,value) ;
            }
        } else {
            console.log("repeat");
            return;
        }
    }
    console.log("AAAAAAAAAAAAAA");
    reset_filtertable();

    var keep_rows = [];
    //temp_table = table
    console.log(temp_table);
    let combos = cartesian(...active_filters);
    console.log("combos",combos);

    if (combos.toString()!==[[''],[''],['']].toString()) {
        for (let i=0; i<combos.length; i++) {
            var out;
            console.log("cringe");
            let selection = combos[i];
            console.log("select",selection);
            for (let j=0; j<selection.length; j++) {
                console.log(selection);
                if (selection[j]!=='') {
                    let key = filter_names[j],
                        value = selection[j];
                    console.log(key,value);
                    out = searchtable(key,value);
                    console.log(out);
                }
            }
            keep_rows = keep_rows.concat(out);
            console.log(out);

            reset_filtertable();
            
            let all_rows = table.getElementsByTagName("tr");
            for (const element of keep_rows) {
                console.log("Removing row:",element);
                all_rows[element].display = "none";
            }
            //console.log("TRS: ",temp_table.getElementsByTagName("tr"))
            //document.getElementById("all").innerHTML = table2;
            //table = document.getElementById("alltable");
            //temp_table = table
            
        }
        
        //reset_filtertable();

        console.log(keep_rows);

        //for(var i in keep_rows){
        //    if(keep_rows[i].Value != ""){
        //        keep_rows[i].Value = parseInt(keep_rows[i].Value);
        //        }
        //}

        //reset_filtertable();

        //let table = document.getElementById("alltable").innerHTML;
        table = document.getElementById("alltable");
        let rows = table.getElementsByTagName("tr");

        for (let j=1; j<rows.length; j++) {
            if (keep_rows.includes(j)) {
                rows[j].style.display = ""; 
            } else {
                rows[j].style.display = "none"; 
            }
        }
        document.getElementById("entires").innerHTML = get_rows();
        
    }
    add_extras();
    stripe();
    
}

function searchtable(key,val) { //'State','NZ'
    console.log("Now loading filter",key, val);
    //console.log('fired')
    var search,
        //table,
        rows,
        ind;
    
    search = val.toUpperCase();
    //console.log(search)
    //console.log(key)

    //table = document.getElementById("alltable").innerHTML;
    console.log("yo");
    console.log("cringe: ",table);
    rows = table.getElementsByTagName("tr");

    let keep = [];

    var ind = head_names.indexOf(key);

    for(let i=0; i<rows.length; i++) {
        td = rows[i].getElementsByTagName("td")[ind];
        //console.log(td)
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(search) > -1 && rows[i].style.display !== "none") {
                keep.push(i);
                rows[i].style.display = "";
            } else { 
                rows[i].style.display = "none"; 
            }
        }
    }
    return keep;
}

function remove_filter(key,val) {
    console.log("Old:",active_filters);
    var id = key+"_"+val;
    document.getElementById(id).remove();
    
    let key_array = filter_names.indexOf(key);

    for (let i=0; i<active_filters[key_array].length; i++) {
        if (active_filters[key_array][i].toString() === val) {
            active_filters[key_array].splice(i,1);
        }
    }
    if (active_filters[key_array].toString() === [].toString()) {
        active_filters[key_array] = [''];
    }
    tablefilter(); 
    //add_extras();
}

