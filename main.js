document.getElementById('fetchData').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKey').value;
  const apiSecret = document.getElementById('apiSecret').value;
  const symbol = document.getElementById('symbol').value;

  if (!apiKey || !apiSecret || !symbol) {
      alert("Please enter API key, API secret, and stock symbol.");
      return;
  }

  try {
      //getting access token 
      const authResponse = await fetch('https://api.upstox.com/index/v1/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey, apiSecret })
      });

      const authData = await authResponse.json();
      if (!authData.access_token) {
          throw new Error("Failed to get access token. Check your API credentials.");
      }

      //fetching the data
      const instrumentsResponse = await fetch(`https://api.upstox.com/index/v1/instruments/${symbol}/data`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authData.access_token}`,
              'Content-Type': 'application/json'
          }
      });

      const stockData = await instrumentsResponse.json();

      // Display the fetched data or an error message if no data is found
      const output = document.getElementById('output');
      if (stockData && stockData.length > 0) {
          output.innerHTML = `<pre>${JSON.stringify(stockData, null, 2)}</pre>`;
      } else {
          output.innerHTML = `<p style="color: red;">No data found for ${symbol}</p>`;
      }

  } catch (error) {
      console.error('Error:', error);
      const output = document.getElementById('output');
      output.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
});
