//Future Improvements:
//Allow multiple word inputs, split them and run each sequentially
//Create empty rows after each normal row in which extras content will be displayed in accordion style

function stripe() {
    /**
     * Sets a seperate class for every second table row so table row colours can be alternated
     */
    let tab = document.getElementById("alltable");
    let all_rows = tab.getElementsByTagName("tr");
    // select all rows which are not hidden
    rows = [];
    for (let i=0; i<all_rows.length; i++) {
        if (all_rows[i].style.display!=='none') {
            rows.push(all_rows[i]);
        }
    }
    // add a class for every second such row
    for(var x = 1; x < rows.length; x++) {  // https://stackoverflow.com/questions/42267771/alternating-table-row-color-robust-to-displaynone-settings
        if (!(x % 2 == 0)) { rows[x].classList.add('alt'); }
        else { rows[x].classList.remove('alt'); }
    }
}

function set_timer() {// https://bobbyhadz.com/blog/detect-when-user-stops-typing-in-javascript
    /**
     * Waits half a second after typing in the input bar before searching
     */
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
    /**
     * Counts the number of rows in the table
     */
    let table = document.getElementById("alltable");
    let rows = table.getElementsByTagName("tr");
    var count = 0;
    for(let i=0; i<rows.length; i++) {
        td = rows[i].getElementsByTagName("td")[0];
        if (td) {
            if (rows[i].style.display === "") {
                count+=1;
            } 
        }
    }
    return "<h5 style='margin:0;'>Entries found: " + count + "</h5>";
}
function reset_filtertable() {
    /**
     * Resets the filter table
     */
    document.getElementById("all").innerHTML = table2;
    table = document.getElementById("alltable");
}

function reset() {
    /**
     * Clears all filters and input bar text to reset the table
     */
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
    reset_filtertable(); 
    document.getElementById("entires").innerHTML = get_rows();  
    add_extras();
    stripe();
}

function add_extras() {
    /**
     * Adds the accordion buttons to filter table
     */
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

async function getData() { //From lecture notes
    /**
     * Fetches the senators.json file
     */
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
        /**
         * Generates the table and filters for the JSON file
         */

        var array = obj.objects;

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
                /**
                 * Adds each unique filter value to an array for that filter name
                 */
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
                /**
                 * Generates table rows
                 */
                if (extras!='none') {
                    return "<tr> <td>"+roles.join('</td><td>')+"</td> <td> <button class='accordion'> See more </button> <div class='panel'> <p>"+extras.join('<br>')+"</p> </div> </td> </tr>";
                }
                else {
                    return "<tr> <td>"+roles.join('</td><td>')+"</td> </tr>";
                }
        }
            function sortrows(party) {
                /**
                 * Sorts the senators by party
                 */
                if (array[i].leadership_title !== null) {
                    title = array[i].leadership_title;
                    roles.unshift(title,":");
                    eval("t_"+party+" += tabrow(roles)");
                } else {
                    eval(party+" += tabrow(roles)");
                }
                eval("no_"+party+" += 1");
                eval("all_"+party+" += tabrow(details,extras)");
            }

            if (party === "Democrat") {
                sortrows("democrat");
            } else if (party === "Republican") {
                sortrows("republican");
            } else {
                sortrows("independent");
            }

        }

        table1 += t_democrat + t_republican + t_independent + "</table>";
        table2 +=  all_democrat + all_republican + all_independent + "</table>";

        document.getElementById("dems").innerHTML = "No of Democrats: " + no_democrat;
        document.getElementById("reps").innerHTML = "No of Republicans: " + no_republican;
        document.getElementById("indep").innerHTML = "No of Independent: " + no_independent;
        document.getElementById("id01").innerHTML = table1;
        document.getElementById("all").innerHTML = table2;

        const searching = ['partys','ranks','states'];
        for(let i=0; i<searching.length; i++) {
            builddrops(searching[i]);
        }
        
        function builddrops(drops) {
            /**
             * Builds the dropdown menus for each filter
             */
            var filter = drops; //partys
            var filter_name = filter.slice(0, -1); //party
            var filter_name_caps = filter_name.charAt(0).toUpperCase() + filter_name.slice(1);
            var filter_list = eval(filter).sort();
            var filter_drop = "<button class='dropbtn' id='"+filter_name+"_button'>"+filter_name_caps+"</button> <div class='drop_content'>";
            var filter_div = "<div class='key_divs' id="+filter_name+"_div> <b style='color:black;display:flex; justify-content:left; margin-bottom:8px;'>"+filter_name_caps+"</b> </div>";
            
            for(let j=0; j<filter_list.length;j++) {
                filter_drop += "<a onclick='multi_col(`"+filter_name_caps+"`,`"+filter_list[j]+"`)'>"+filter_list[j]+"</a>";
            }

            filter_drop += "</div> </div>";

            eval('document.getElementById("drop_'+filter_name+'").innerHTML = "'+ filter_drop + '"');
            eval('document.getElementById("active_filters").innerHTML +="'+filter_div+'"');
        }

        table = document.getElementById("alltable"); 
        let rows = table.getElementsByTagName("tr");
        let heads = rows[0].getElementsByTagName("th");
        for(let i=0; i<heads.length; i++) {
            head_names.push(heads[i].innerText);
        }
        document.getElementById("entires").innerHTML = get_rows();

        acc = document.getElementsByClassName("accordion");
        
        var root = document.querySelector(':root'); //Variables for use in CSS file
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

async function tablefilter() {
    /**
     * Brings functionality to the tables search bar
     */

    multi_col();

    var heads,
        search,
        rows;
    
    search = inputbar.value.toUpperCase();

    table = document.getElementById("alltable");
    rows = table.getElementsByTagName("tr");
    heads = rows[0].getElementsByTagName("th");

    var head_names = [];
    for(let i=0; i<heads.length; i++) {
        head_names.push(heads[i].innerText);
    }

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

function cartesian(...args) { //Stole from stack exchange: https://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements
    /**
     * Cartesian product generates all possible combinations of the 3 types of filters
     */
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

function multi_col(key=0,value=0) {
    /**
     * Sequentially applies each combination of the 3 types of filters and displays the union of each
     */
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
                let add_button = '<button id='+key+'_'+value+' onclick="remove_filter(`'+key+'`,`'+value+'`)"><p style="color:grey; float:left; margin:0;">x</p> <p style="float:center; margin:0;">'+value+'</p></button>';
                let div = key.toLowerCase()+"_div";
                document.getElementById(div).innerHTML += add_button;
            }
        } else {
            return;
        }
    }

    reset_filtertable();

    var keep_rows = [];
    let combos = cartesian(...active_filters);

    if (combos.toString()!==[[''],[''],['']].toString()) {
        for (let i=0; i<combos.length; i++) {
            var out;
            let selection = combos[i];

            for (let j=0; j<selection.length; j++) {
                if (selection[j]!=='') {
                    let key = filter_names[j],
                        value = selection[j];
                    out = searchtable(key,value);
                }
            }
            keep_rows = keep_rows.concat(out);

            reset_filtertable();
            
            let all_rows = table.getElementsByTagName("tr");
            for (const element of keep_rows) {
                all_rows[element].display = "none";
            }
        }

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

function searchtable(key,val) { 
    /**
     * Searches the table for filter name, filter value pair
     */
    var search,
        rows,
        ind;
    
    search = val.toUpperCase();

    rows = table.getElementsByTagName("tr");

    let keep = [];

    var ind = head_names.indexOf(key);

    for(let i=0; i<rows.length; i++) {
        td = rows[i].getElementsByTagName("td")[ind];
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
    /**
     * Removes a filter from the table
     */
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
}

