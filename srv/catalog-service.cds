using {com.logali as logali} from '../db/schema';

service CatalogService {
    entity Products as projection on logali.Products;
    entity Suppliers as projection on logali.Suppliers;
    //entity Car as projection on logali.Car;
    entity UnitOfMeasures as projection on logali.UnitOfMeasures;
    entity ProductReviews as projection on logali.ProductReviews;
    entity Currencies       as projection on logali.Currencies;
    entity DimensionUnit   as projection on logali.DimensionUnits;
    entity Category        as projection on logali.Categories;
    entity SalesData       as projection on logali.SalesData;
    entity Orders       as projection on logali.Orders;
    entity OrderItems      as projection on logali.OrderItems;
}
