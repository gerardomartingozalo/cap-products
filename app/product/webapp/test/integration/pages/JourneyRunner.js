sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"logaligroup/product/test/integration/pages/ProductsList",
	"logaligroup/product/test/integration/pages/ProductsObjectPage",
	"logaligroup/product/test/integration/pages/ReviewsObjectPage"
], function (JourneyRunner, ProductsList, ProductsObjectPage, ReviewsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('logaligroup/product') + '/test/flp.html#app-preview',
        pages: {
			onTheProductsList: ProductsList,
			onTheProductsObjectPage: ProductsObjectPage,
			onTheReviewsObjectPage: ReviewsObjectPage
        },
        async: true
    });

    return runner;
});

