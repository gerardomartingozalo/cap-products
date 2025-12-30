const cds = require("@sap/cds");
const { Orders } = cds.entities("com.training");

module.exports = (srv) => {
    srv.before("*", (req) => {
        console.log(`Method: ${req.method}`);
        console.log(`Target: ${req.target}`);
    });


//************READ******
srv.on("READ", "GetOrders", async (req) => {
    if (req.data.ClientEmail !== undefined) {
        return await SELECT.from`com.training.Orders`
            .where`ClientEmail = ${req.data.ClientEmail}`;
    }

    return await SELECT.from(Orders);
});


srv.after("READ", "GetOrders", (data) => {
    return data.map((order) => (order.Reviewed = true));
});


srv.on("CREATE", "CreateOrder", async (req) => {
    let returnData = await cds
        .transaction(req)
        .run(
            INSERT.into(Orders).entries({
                ClientEmail: req.data.ClientEmail,
                FirstName: req.data.FirstName,
                LastName: req.data.LastName,
                CreatedOn: req.data.CreatedOn,
                Reviewed: req.data.Reviewed,
                Approved: req.data.Approved,
            })
        )
        .then((resolve, reject) => {
            console.log("Resolve", resolve);
            console.log("Reject", reject);

            if (typeof resolve !== "undefined") {
                return req.data;
            } else {
                req.error(409, "Record Not Inserted");
            }
        })
        .catch((err) => {
            console.log(err);
            req.error(err.code, err.message);
        });
    console.log('Before End', returnData);
    return returnData;

});


srv.before("CREATE", "CreateOrder", (req) => {
    req.data.CreatedOn = new Date().toISOString().slice(0, 10);
    return req;
});


//***************UPDATE********/
srv.on("UPDATE", "UpdateOrder", async (req) => {
    let returnData = await cds
        .transaction(req)
        .run([
            UPDATE(Orders, req.data.ClientEmail).set({
                FirstName: req.data.FirstName,
                LastName: req.data.LastName,
            }),
        ])
        .then((resolve, reject) => {
            console.log("Resolve: ", resolve);
            console.log("Reject: ", reject);

            if (resolve[0] == 0) {
                req.error(409, "Record Not Found");
            }
        }).catch((err) => {
            console.log(err);
            req.error(err.code, err.message);
        });
    console.log("Before End", returnData);
});


//************DELETE*******/
srv.on("DELETE", "DeleteOrder", async (req) => {
  let returnData = await cds
    .transaction(req)
    .run(
      DELETE.from(Orders).where({
        ClientEmail: req.data.ClientEmail,
      })
    )
    .then((resolve, reject) => {
      console.log("Resolve", resolve);
      console.log("Reject", reject);

      if (resolve !== 1) {
        req.error(409, "Record Not Found");
      }
    })
    .catch((err) => {
      console.log(err);
      req.error(err.code, err.message);
    });
  console.log("Before End", returnData);
  return await returnData;
});

//***************FUNCTION*******/
srv.on("getClientTaxRate", async (req) => {
    try {
        //NO server side-effect
        const { clientEmail } = req.data;

        console.log("Received clientEmail:", clientEmail);

        if (!clientEmail) {
            req.error(400, "clientEmail parameter is required");
            return;
        }

        const db = srv.transaction(req);

        // Usar el nombre de la entidad como string
        const results = await db
            .read('Orders', ['Country_code'])
            .where({ ClientEmail: clientEmail });

        console.log("Query results:", results);

        // Verificar si se encontró el cliente
        if (!results || results.length === 0) {
            req.error(404, "Client not found");
            return;
        }

        const countryCode = results[0].Country_code;
        console.log("Country code:", countryCode);

        // Switch con todas las opciones
        switch (countryCode) {
            case "ES":
                return 21.5;
            case "UK":
                return 24.6;
            case "DE":
                return 19.0;
            case "FR":
                return 20.0;
            default:
                console.log("Unknown country code, returning default rate");
                return 0.0;
        }
    } catch (err) {
        console.error("Error in getClientTaxRate:", err);
        req.error(500, err.message || "Internal server error");
    }
});



//************ACTION*******/
srv.on("cancelOrder", async (req) => {
    try {
        const { clientEmail } = req.data;

        if (!clientEmail) {
            req.error(400, "clientEmail parameter is required");
            return;
        }

        const db = srv.transaction(req);

        // IMPORTANTE: Obtener Orders del contexto del servicio
        const { Orders } = srv.entities;

        const resultsRead = await db
            .read(Orders, ["FirstName", "LastName", "Approved"])
            .where({ ClientEmail: clientEmail });

        let returnOrder = {
            status: "",
            message: "",
        };

        console.log(clientEmail);
        console.log(resultsRead);

        if (!resultsRead || resultsRead.length === 0) {
            returnOrder.status = "Failed";
            returnOrder.message = "Client not found";
            return returnOrder;
        }

        if (resultsRead[0].Approved == false) {
            const resultsUpdate = await db
                .update(Orders)
                .set({ Status: "C" })
                .where({ ClientEmail: clientEmail });
            returnOrder.status = "Succeeded";
            returnOrder.message = `The Order placed by ${resultsRead[0].FirstName} ${resultsRead[0].LastName} was cancelled`;
        } else {
            returnOrder.status = "Failed";
            returnOrder.message = `The Order placed by ${resultsRead[0].FirstName} ${resultsRead[0].LastName} was NOT cancelled`;
        }

        console.log("Action cancelOrder executed");
        return returnOrder;
    } catch (err) {
        console.error("Error in cancelOrder:", err);
        req.error(500, err.message || "Internal server error");
    }
});

};