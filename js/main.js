// nazivi funkcija su jasni tako da nisu pisani dodatni komentari //

$(document).ready(function () {
    
    $.ajax({
        url : "data/cars.json",
        method : "GET",
        dataType : "json",
        success : function(data){
            popuniAuta(data);
            sortZapamti(data);
            popuniAutaAkcija(data);
            popuniTabelu(data);
        },
        error : function(xhr, status, error) {
            console.log("greska ajax!");
        }
    });

    $.ajax({
        url : "data/categories.json",
        method : "GET",
        dataType : "json",
        success : function(data) {
            popuniKategorije(data);
        },
        error : function(xhr, status, error) {
            console.log("greska ajax ddl");
        }
    });

    $("#kategorije").change(prikaziKlase);
    $("#search").keyup(prikaziAuta);
    $("#sortCena").change(sortiraj);


    function sortiraj() {
        const sortId = this.value;
        console.log(sortId);
        zapamtiSort(sortId);
        $.ajax({
            url : "data/cars.json",
            method : "GET",
            dataType : "json",
            success : function(data) {
                if (sortId == 1) {
                data.sort(function (el1, el2) {

                    return el1.cena.cena6 - el2.cena.cena6;
                    // if (el1.cena.cena6 > el2.cena.cena6) 
                    //     return 1;
                    // if (el1.cena.cena6 < el2.cena.cena6)
                    //     return -1;
                    // if (el1.cena.cena6 == el2.cena.cena6)
                    //     return 0;
                });
                popuniAuta(data);
            }
            else if (sortId == 2) {
                data.sort(function (el1, el2) {

                    return el2.cena.cena6 - el1.cena.cena6;
                    // if (el1.cena.cena6 < el2.cena.cena6) 
                    //     return 1;
                    // if (el1.cena.cena6 > el2.cena.cena6)
                    //     return -1;
                    // if (el1.cena.cena6 == el2.cena.cena6)
                    //     return 0;
                });
                popuniAuta(data);
            }
            },
            error : function(xhr, status, error) {
                console.log("greska ajax ddl");
            }
        });
    };


    function prikaziAuta() {
        const pretraga = this.value;
        $.ajax({
            url : "data/cars.json",
            method : "GET",
            dataType : "json",
            success : function(data) {
              const newArray = data.filter( element =>{
                if(element.naziv.toLowerCase().indexOf(pretraga.toLowerCase().trim()) != -1) {
                    return true;
                }
              });
              popuniAuta(newArray);
            },
            error : function(xhr, status, error) {
                console.log("greska ajax ddl");
            }
        });
    }

    function popuniKategorije(data) {
        let ispis = "";
        ispis += `<option value="0">Kategorije</option>`;
        data.forEach(element => {
            ispis += `<option value="${element.idKat}">${element.naziv}</option>`;
        });
        $("#kategorije").html(ispis);

    };

    function prikaziKlase() {
        const idKlasa = this.value;
        $.ajax({
            url : "data/cars.json",
            method : "GET",
            dataType : "json",
            success : function(data) {
                const autaKategorije = data.filter(function (element) {
                   return element.klasa.idKlasa == idKlasa;
                    });
                popuniAuta(autaKategorije);
            },
            error : function(xhr, status, error) {
                console.log("greska ajax klase");
            }
        });
    };


    function sortZapamti(data) {
        if (!isEmtpyStorage()) {
            let sortirani = getStrorage();
            let nesto = sortirani.sortBy;
            console.log(nesto);
            sortAuta(data, nesto);
        }
    }

    function sortAuta(data, sort) {
        
        if (sort == 1) {
            data.sort(function (el1, el2){

                return el1.cena.cena6 - el2.cena.cena6;
                // if (el1.cena.cena6 > el2.cena.cena6) 
                //         return 1;
                //     if (el1.cena.cena6 < el2.cena.cena6)
                //         return -1;
                //     if (el1.cena.cena6 == el2.cena.cena6)
                //         return 0;
            });
            prikaziAuta(data);
        }
        else if (sort == 2) {
            data.sort(function (el1, el2) {

                return el2.cena.cena6 - el1.cena.cena6;
                // if (el1.cena.cena6 < el2.cena.cena6) 
                //         return 1;
                //     if (el1.cena.cena6 > el2.cena.cena6)
                //         return -1;
                //     if (el1.cena.cena6 == el2.cena.cena6)
                //         return 0;
            });
            popuniAuta(data);
        }

    }
    function popuniAuta(data) {
        let ispis = "";
        var x = "";

        data.forEach(element => {

            // let vreme = new Date(element.datum);
            //let meseci = ["januar,..."];
            // let ispisVreme = vreme.getDate() + "/" + meseci[vreme.getmonth()] + "/" vreme.getfullyear;

            ((element.akcija == true) ?  x = "<i class='akcija'>Akcija!</i>" : x = "");
            ispis += `<div class="one_third shadow auto">
            <div class="view view-first">
            <img src="${element.slika}" alt="${element.naziv}" />
            </div>
            <h1 class='naziv'>${element.naziv} ${x}</h1>
            <p class='klasa'>Klasa: <i class='class'>${element.klasa.naziv}</i></p>
            <p class='cena'>Po ceni već od <i class="price">${element.cena.cena6}&euro;</i></p>
            <div class="showHide">
                <p>Gorivo: ${element.gorivo}</p>
                <p>Menjač: ${element.menjac}</p>
                <p>Broj putnika: ${element.brojPutnika}</p>
            </div>
            <input type="button" class="dugme" value="Pogledaj više"/>`;
            ispis += "</div>";
        });
        $("#ispis").html(ispis);

        // $(".dugme").click(function(){
        //     $(this).siblings('.showHide').slideToggle();
        // });
    };

    $(document).on("click", ".dugme", function() {
        $(this).siblings('.showHide').slideToggle();
    })



    function popuniAutaAkcija(data) {
        let ispis = "";
        var x = "";

        data.forEach(element => {
            if (element.akcija == true) {
                element.cena.cena6 = element.cena.cena6 - (element.cena.cena6 * 0.1) ;
            ((element.akcija == true) ?  x = "<i class='akcija'>Akcija!</i>" : x = "");
            ispis += `<div class="one_third shadow auto">
            <div class="view view-first">
            <img src="${element.slika}" alt="${element.naziv}" />
            </div>
            <h1 class='naziv'>${element.naziv} ${x}</h1>
            <p class='klasa'>Klasa: <i class='class'>${element.klasa.naziv}</i></p>
            <p class='cena'>Po ceni već od <i class="price">${element.cena.cena6}&euro;</i></p>
            <p class='gorivo'>Vrsta goriva: ${element.gorivo}</p>
            <p class='menjac'>Vrsta menjača: ${element.menjac}</p>
            <p class='putnici'>Broj putnika: ${element.brojPutnika}</p>`;
            ispis += "</div>";
            }});
        $("#pocetna").html(ispis);
    };

    function popuniTabelu(data) {
        let ispis = "";
        data.forEach(element => {
            ispis += `<tr>
            <td>${element.klasa.naziv}</td><td>${element.naziv}</td><td>${element.cena.cena1}</td><td>${element.cena.cena2}</td><td>${element.cena.cena3}</td><td>${element.cena.cena4}</td><td>${element.cena.cena5}</td><td>${element.cena.cena6}</td><td>${element.cena.depozit}</td>`;
            ispis += "</tr>";
        
        });
        $("#tBody").html(ispis);
        $("#tabela tbody tr:even").css('background-color', '#0080ff');

        $("#tabela tbody tr").hover(function() {
            $(this).css("color", "red"); },
            function() {
                $(this).css("color", "black");
            });
        

    }

    function zapamtiSort(sort) {
        setStorage({ sortBy : sort});
    }

    function setStorage(obj) {
        console.log(obj);
        return localStorage.setItem('sort', JSON.stringify(obj));
        
    }

    function isEmtpyStorage() {
        return localStorage.getItem('sort') === null;
    }

    function getStrorage() {
        return JSON.parse(localStorage.getItem('sort'));
    }

    // Drugi deo - regularni izrazi //


    $("#dugme").click(provera);

    var regexName = /^[A-Z][a-z]{2,13}(\s[A-Z][a-z]{2,13}){1,2}$/;
    var regexEmail = /^[\w\.]{1,20}@[\w]{2,10}(\.[a-z]{2,5}){1,4}$/;
    var regexText = /^[\w\.\s]{1,}$/;
    
    function provera() {

        var greska = false;
        var name = $("#name").val();
        var email = $("#email").val();
        var text = $("#message").val();

        if(!regexName.test(name)) {
            $("#name").val("Ime uneto u pogrešnom formatu!");
            greska = true;
        }
        if(!regexEmail.test(email)) {
            $("#email").val("Email unet u pogrešnom formatu!");
            greska = true;
        }
        if(!regexText.test(text)) {
            $("#message").val("Poruka uneta u pogrešnom formatu!");
            greska = true;
        }

        if(!greska) {
            alert("Poruka uspešno poslata!");
        }
    }

});