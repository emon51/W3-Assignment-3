// attraction-server.js
import express from "express";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const API_KEY = process.env.RAPIDAPI_KEY;

if (!API_KEY) {
  console.error("ERROR: RAPIDAPI_KEY not found in environment variables!");
  process.exit(1);
}

app.get('/', async (req, res) => {
  res.send("Attraction API is Running...");
});

// 1. Search Attraction Location
app.get('/attraction-location', async (req, res) => {
  try {
    const query = req.query.query || 'mumbai';
    
    console.log(`Searching for location: ${query}`);
    
    const response = await axios.get(
      'https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation',
      {
        params: { query, languagecode: 'en-us' },
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
        }
      }
    );
    
    if (response.data?.data?.destinations && response.data.data.destinations.length > 0) {
      console.log("Found destinations:");
      response.data.data.destinations.forEach((dest, i) => {
        console.log(`  ${i + 1}. ${dest.name} (dest_id: ${dest.dest_id})`);
      });
    }
    
    if (response.data?.data?.products && response.data.data.products.length > 0) {
      console.log("Found products:");
      const uniqueCities = [...new Set(response.data.data.products.map(p => 
        `${p.cityName}, ${p.countryCode} (ufi: ${p.cityUfi})`
      ))];
      uniqueCities.forEach((city, i) => {
        console.log(`  ${i + 1}. ${city}`);
      });
    }
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data || "No additional details"
    });
  }
});

// 2. Search Attractions by Destination ID
app.get('/search-attractions', async (req, res) => {
  try {
    const destId = req.query.dest_id;
    
    if (!destId) {
      return res.status(400).json({ error: 'dest_id parameter is required' });
    }

    console.log(`Fetching attractions for dest_id: ${destId}`);

    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions",
      {
        params: { 
          id: destId,
          page: 1,
          currency_code: "USD",
          languagecode: "en-us"
        },
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    const products = response.data?.data?.products || [];
    console.log(`Found ${products.length} attractions`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
});

// 3. Get Attraction Details
app.get('/attraction-details', async (req, res) => {
  try {
    const productId = req.query.product_id;
    
    if (!productId) {
      return res.status(400).json({ error: 'product_id parameter is required' });
    }

    console.log(`Fetching details for product: ${productId}`);

    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/attraction/getProductDetails",
      {
        params: { 
          productId,
          currency_code: "USD",
          languagecode: "en-us"
        },
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
});

// 4. Generate CSV with Full Details
app.get('/generate-detailed-csv', async (req, res) => {
  try {
    const destId = req.query.dest_id;
    const locationName = req.query.location || 'Unknown';
    const limit = parseInt(req.query.limit) || 10;
    
    if (!destId) {
      return res.status(400).json({ error: 'dest_id parameter is required' });
    }

    console.log(`\n🔍 Step 1: Searching attractions for dest_id: ${destId}`);

    // Step 1: Get list of attractions
    const searchResponse = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions",
      {
        params: { 
          id: destId,
          page: 1,
          currency_code: "USD",
          languagecode: "en-us"
        },
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    const products = searchResponse.data?.data?.products || [];
    console.log(`Found ${products.length} attractions`);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'No attractions found' });
    }

    const results = [];
    const productsToFetch = products.slice(0, limit);

    // Step 2: Get detailed info for each attraction
    console.log(`\n Step 2: Fetching details for ${productsToFetch.length} attractions...`);

    for (let i = 0; i < productsToFetch.length; i++) {
      const product = productsToFetch[i];
      console.log(`  ${i + 1}/${productsToFetch.length}: ${product.name}`);

      try {
        const detailsResponse = await axios.get(
          "https://booking-com15.p.rapidapi.com/api/v1/attraction/getProductDetails",
          {
            params: { 
              productId: product.productId,
              currency_code: "USD",
              languagecode: "en-us"
            },
            headers: {
              "x-rapidapi-key": API_KEY,
              "x-rapidapi-host": "booking-com15.p.rapidapi.com",
            },
          }
        );

        const details = detailsResponse.data?.data;

        if (details) {
          results.push({
            "Attraction Name": details.name || "N/A",
            "Attraction Slug": details.slug || "N/A",
            "Short Description": details.shortDescription || "N/A",
            "Description": details.description?.replace(/\r\n/g, " ").substring(0, 500) || "N/A",
            "Additional Info": details.additionalInfo?.replace(/\r\n/g, " ") || "N/A",
            "Cancellation Policy": details.cancellationPolicy?.hasFreeCancellation ? "Free cancellation" : "No free cancellation",
            "Primary Image": details.primaryPhoto?.small || "N/A",
            "All Images": details.photos?.slice(0, 5).map(p => p.medium).join(" | ") || "N/A",
            "Price (USD)": details.representativePrice?.publicAmount || "N/A",
            "Currency": details.representativePrice?.currency || "USD",
            "What's Included": details.whatsIncluded?.join(" | ") || "N/A",
            "Not Included": details.notIncluded?.join(" | ") || "N/A",
            "Country": details.ufiDetails?.url?.country || "N/A",
            "City": details.ufiDetails?.bCityName || locationName,
            "Operated By": details.operatedBy || "N/A",
            "Languages": details.guideSupportedLanguages?.join(", ") || "N/A",
            "Rating": details.reviewsStats?.combinedNumericStats?.average || "N/A",
            "Total Reviews": details.reviewsStats?.combinedNumericStats?.total || 0,
            "Product ID": details.id || "N/A"
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (detailError) {
        console.error(`Failed to get details: ${detailError.message}`);
        // Add basic info even if details fail
        results.push({
          "Attraction Name": product.name || "N/A",
          "Attraction Slug": product.slug || "N/A",
          "Short Description": product.shortDescription || "N/A",
          "Description": "N/A",
          "Additional Info": "N/A",
          "Cancellation Policy": "N/A",
          "Primary Image": product.primaryPhoto?.small || "N/A",
          "All Images": "N/A",
          "Price (USD)": product.representativePrice?.publicAmount || "N/A",
          "Currency": "USD",
          "What's Included": "N/A",
          "Not Included": "N/A",
          "Country": product.ufiDetails?.url?.country || "N/A",
          "City": product.ufiDetails?.bCityName || locationName,
          "Operated By": "N/A",
          "Languages": "N/A",
          "Rating": "N/A",
          "Total Reviews": 0,
          "Product ID": product.productId || "N/A"
        });
      }
    }

    // Step 3: Generate CSV
    console.log(`\n Step 3: Generating CSV file...`);

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "N/A";
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const header = Object.keys(results[0]).join(",");
    const rows = results.map(obj => 
      Object.values(obj).map(escapeCSV).join(",")
    );
    const csv = [header, ...rows].join("\n");
    
    const filename = `attractions_${locationName.replace(/\s/g, '_')}_${Date.now()}.csv`;
    fs.writeFileSync(filename, csv);
    
    console.log(`CSV file created: ${filename}`);
    console.log(`   Total attractions: ${results.length}`);
    
    res.status(200).json({
      message: `Data saved to ${filename}`,
      count: results.length,
      file: filename,
      location: locationName,
      preview: results.slice(0, 3)
    });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
});

// 5. Quick CSV (Basic Info Only - Faster)
app.get('/generate-quick-csv', async (req, res) => {
  try {
    const destId = req.query.dest_id;
    const locationName = req.query.location || 'Unknown';
    const limit = parseInt(req.query.limit) || 30;
    
    if (!destId) {
      return res.status(400).json({ error: 'dest_id parameter is required' });
    }

    console.log(`Fetching basic info for attractions (dest_id: ${destId})`);

    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions",
      {
        params: { 
          id: destId,
          page: 1,
          currency_code: "USD",
          languagecode: "en-us"
        },
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    const products = response.data?.data?.products || [];
    const results = products.slice(0, limit).map(product => ({
      "Attraction Name": product.name || "N/A",
      "Slug": product.slug || "N/A",
      "Short Description": product.shortDescription || "N/A",
      "Price (USD)": product.representativePrice?.publicAmount || "N/A",
      "Primary Image": product.primaryPhoto?.small || "N/A",
      "City": product.ufiDetails?.bCityName || locationName,
      "Country": product.ufiDetails?.url?.country || "N/A",
      "Product ID": product.productId || "N/A"
    }));

    if (results.length > 0) {
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return "N/A";
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const header = Object.keys(results[0]).join(",");
      const rows = results.map(obj => 
        Object.values(obj).map(escapeCSV).join(",")
      );
      const csv = [header, ...rows].join("\n");
      
      const filename = `attractions_quick_${locationName.replace(/\s/g, '_')}_${Date.now()}.csv`;
      fs.writeFileSync(filename, csv);
      console.log(`Quick CSV created: ${filename} (${results.length} attractions)`);
      
      res.status(200).json({
        message: `Quick data saved to ${filename}`,
        count: results.length,
        file: filename
      });
    } else {
      res.status(404).json({ error: 'No attractions found' });
    }

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});