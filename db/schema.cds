namespace com.logali;

using {
    cuid,
    managed
} from '@sap/cds/common';

type Name : String(50);

type Address {
    Street     : String;
    City       : String;
    State      : String(2);
    PostalCode : String(5);
    Country    : String(3);
}

type Dec  : Decimal(16, 2);

context materials {

    //Association Unmanaged
    entity Products : cuid, managed {
        //key ID               : UUID;
        Name             : localized String not null;
        Description      : localized String;
        ImageUrl         : String;
        ReleaseDate      : DateTime default $now;
        DiscontinuedDate : DateTime;
        Price            : Dec;
        Height           : type of Price;
        Width            : Decimal(16, 2);
        Depth            : Decimal(16, 2);
        Quantity         : Decimal(16, 2);
        Supplier         : Association to sales.Suppliers;
        UnitOfMeasure    : Association to UnitOfMeasures;
        Currency         : Association to Currencies;
        DimensionUnit    : Association to DimensionUnits;
        Category         : Association to Categories;
        SalesData        : Association to many sales.SalesData
                               on SalesData.Product = $self;
        Reviews          : Association to many ProductReview
                               on Reviews.Product = $self;
    };

    extend Products with {
        PriceCondition     : String(2);
        PriceDetermination : String(3);
    };
    //association Manage
    // entity Products {
    //     key ID               : UUID;
    //         Name             : String not null;
    //         Description      : String;
    //         ImageUrl         : String;
    //         ReleaseDate      : DateTime default $now;
    //         DiscontinuedDate : DateTime;
    //         Price            : Dec;
    //         Height           : type of Price;
    //         Width            : Decimal(16, 2);
    //         Depth            : Decimal(16, 2);
    //         Quantity         : Decimal(16, 2);
    //         Supplier_Id      : UUID;
    //         ToSupplier       : Association to one Suppliers
    //                                on ToSupplier.ID = Supplier_Id;
    //         UnitOfMeasure_Id : String(2);
    //         ToUnitOfMeasure  : Association to UnitOfMeasures
    //                                on ToUnitOfMeasure.ID = UnitOfMeasure_Id;
    // }

    entity Categories : cuid {
        //key ID   : String(1);
        Name    : localized String;
        Product : Association to Products;
    }

    entity StockAvailability : cuid {
        //key ID          : Integer;
        Description : localized String;
        Product     : Association to Products;
    }

    entity Currencies {
        key ID          : String(3);
            Description : localized String;
    }

    entity UnitOfMeasures : cuid {
        //key ID          : String(2);
        Description : localized String;
    }

    entity DimensionUnits : cuid {
        //key ID          : String(2);
        Description : localized String;
    }

    entity Months : cuid {
        //key ID               : String(2);
        Description      : localized String;
        ShortDescription : localized String(3);
    }

    entity ProductReview : cuid, managed {
        //key ID        : UUID;
        Name      : String;
        Rating    : Integer;
        Comment   : String;
        Product   : Association to Products;
    }
}

context sales {

    entity Suppliers : cuid {
        //key ID      : UUID;
        Name    : localized String not null;
        Address : Address;
        Email   : String;
        Phone   : String;
        Fax     : String;
        Product : Association to many materials.Products
                      on Product.Supplier = $self;
    }

    entity Orders : cuid {
        //key ID       : UUID;
        Date     : Date;
        Customer : String;
        Item     : Composition of many OrderItems
                       on Item.Order = $self;
    }

    // entity Orders {
    //     key ID       : UUID;
    //         Date     : Date;
    //         Customer : String;
    //         //Item     : Composition of many OrderItems
    //         //                on Item.Order = $self;
    //         Item     : Composition of many {
    //             key Position : UUID;
    //                 Order    : Association to Orders;
    //                 Product  : Association to Products;
    //                 Quantity : Integer;
    //         }
    // };

    entity OrderItems : cuid {
        //key ID       : UUID;
        Order    : Association to Orders;
        Product  : Association to materials.Products;
        Quantity : Integer;
    }


    entity SalesData : cuid {
        //key ID            : UUID;
        DeliveryDate  : DateTime;
        Revenue       : Decimal(16, 2);
        Product       : Association to materials.Products;
        Currency      : Association to materials.Currencies;
        DeliveryMonth : Association to materials.Months;
    }


    entity SelProducts   as select from materials.Products;

    entity SelProducts1  as
        select from materials.Products {
            *
        };


    entity SelProducts2  as
        select from materials.Products {
            Name,
            Price,
            Quantity
        };

    // entity SelProducts3  as
    //     select from materials.Products
    //     left join materials.ProductReview
    //         on Products.Name = Reviews.Name
    //     {
    //         Rating,
    //         Products.Name,
    //         sum(Price) as TotalPrice
    //     }
    //     group by
    //         Rating,
    //         Products.Name
    //     order by
    //         Rating;


    entity ProjProducts  as projection on materials.Products;

    entity ProjProducts2 as
        projection on materials.Products {
            *
        };

    entity ProjProducts3 as
        projection on materials.Products {
            ReleaseDate,
            Name
        };


// entity ParamProducts(pName : String) as
//     select from Products {
//         Name, Price, Quantity
//     } where Name = :pName;

// entity ProjParamProducts(pName : String) as
//     projection on Products
//     where Name = :pName;
}
