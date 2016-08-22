// URL beginning and end, which will be used with the key
// To give Tabletop a URL
var google_docs_one = 'https://docs.google.com/spreadsheet/pub?key=';
var google_docs_two = '&output=html';

// Google Docs spreadsheet key
var spreadsheet_key = '18oR4Cuf8JxQEtsNKiSu5PIIEo0dSFMIePKnwFgsk788';

// Template sources and what DIVs they will appear in
var templates = [
    {
        "templatesource": "#datatable-template",
        "templatehtml": "#searchable-table tbody",
        "sheet": "Hoja 1"
    }
];

// DataTables formatting options
// More options: http://datatables.net/plug-ins/sorting

// Formatted numbers: i.e. numbers with commas
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "formatted-num-pre": function ( a ) {
        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },
    "formatted-num-asc": function ( a, b ) {
        return a - b;
    },
    "formatted-num-desc": function ( a, b ) {
        return b - a;
    }
});
// Currency
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "currency-pre": function ( a ) {
        a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },
    
    "currency-asc": function ( a, b ) {
        return a - b;
    },
    
    "currency-desc": function ( a, b ) {
        return b - a;
    }
});
// Percentages
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "percent-pre": function ( a ) {
        var x = (a == "-") ? 0 : a.replace( /%/, "" );
        return parseFloat( x );
    },
 
    "percent-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
 
    "percent-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

// Load up the DataTable
function loadDataTable() {
    // Load Datatables after Tabletop is loaded
    $('#searchable-table').dataTable({
        "bAutoWidth": false,
        "oLanguage": {
            "sProcessing":    "Procesando...",
                "sLengthMenu":    "Mostrar _MENU_ partidos",
                "sZeroRecords":   "No se encontraron partidos",
                "sEmptyTable":    "No hay partidos en los registros",
                "sInfo":          "Mostrando partidos del _START_ al _END_ de un total de _TOTAL_ partidos",
                "sInfoEmpty":     "Mostrando partidos del 0 al 0 de un total de 0 partidos",
                "sInfoFiltered":  "(filtrado de un total de _MAX_ partidos)",
                "sInfoPostFix":   "",
                "sSearch":        "Buscar:",
                "sUrl":           "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":    "Último",
                    "sNext":    "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
        },
        "iDisplayLength": 100,
        "aaSorting": [[ 0, "asc" ]],
        "aoColumns": [
           {
                "sWidth": "15%"
                // "sType": "formatted-num" 
            },{
                "sWidth": "8%"
                // "sType": "formatted-num" 
            },{
                "sWidth": "33%"
                // "sType": "formatted-num" 
            },{
                "sWidth": "25%"
                // "sType": "formatted-num" 
            },{
                "sWidth": "25%"
                // "sType": "formatted-num" 
            }
        ],
        // Fix thead to top of page when scrolling past it
        "initComplete": function(settings, json) {
            $('#searchable-table').show();
        }
    });
// Close loadDataTable
};

// Use Handlebars to load data from Tabletop to page
function loadToDOM(tabletop_data, tabletop) {
    // Loop through templates
    _.each(templates, function(element, num_templates) {
    	// Grab HTML of template and compile with Handlebars
    	var template_html = element['templatehtml'];    
    	var source = $(element["templatesource"] + "").html();
    	var sheet = element["sheet"];
        var handlebarscompile = Handlebars.compile(source);

		// Render the templates onto page
		$(template_html).append(handlebarscompile( tabletop.sheets(sheet) ));
	// Close each statement
    }, this);

    loadDataTable();
}


// Pull data from Google spreadsheet via Tabletop
function initializeTabletopObject(){
	Tabletop.init({
    	key: google_docs_one + spreadsheet_key + google_docs_two,
    	callback: loadToDOM,
    	simpleSheet: false,
    	debug: false
    });
}

// Load Tabletop
initializeTabletopObject();
