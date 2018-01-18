// Populate currency list from Currency API
function populateCurrencyNames() {

    pullCrypto(function (cryptoList) {
        // Store full list in firebase
        database.ref("/cryptoList").set(cryptoList);

    });
}


// Populate the search bar with currency names from firebase
database.ref("/cryptoList").once("value", function (snapshot) {
    let currencyNames = snapshot.val();
    if (!currencyNames) {
        // Refresh data from API
        populateCurrencyNames();
    } else {
        configureSearchBar(currencyNames);
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

////////////  Configuration and functions for the easyautocomplete plugin ////////////
function configureSearchBar(currencyNames) {

    // Config for easyautocomplete plugin
    let config = {
        data: currencyNames,
        getValue: function(element) {
            // display Name (Symbol) for all currencies in the dropdown
            return `${element.name} (${element.symbol})`;
        },
        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                // Get id of the currency and store as data on the search button
                let value = $(".auto-complete").getSelectedItemData().id;
                $("#search-currency").attr("currency", value);
            }
        }, theme: "square", cssClasses: "form-control form-control-sm fix-autocomplete input-group"

    };
    $('.auto-complete').easyAutocomplete(config);
    // Fix for working with bootstrap input-group and alignment
    $(".easy-autocomplete").removeAttr("style");
    let $easyContainer = $(".easy-autocomplete-container");
    $easyContainer.css("text-align", "left");
    $easyContainer.css("margin-top", "40px");
}