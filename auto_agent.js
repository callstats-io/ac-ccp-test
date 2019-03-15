const puppeteer = require('puppeteer');
require('log-timestamp');

const assert = require('assert');
var agent_name = process.env.AGENT_NAME;
var agent_password = process.env.AGENT_PASSWORD;

assert(agent_name);
assert(agent_password);

async function chkForButton(page, btnSelector) {
  try {
    // console.log(`checking ${btnSelector} button`)
    let result = await page.waitForSelector(btnSelector, {
      timeout: 1000
    });
    if (result) {
      // console.log(`found the ${btnSelector} button`);
      return true;
    } else {
      // console.log(`didn't find the ${btnSelector} button`);
      return false;
    }
  } catch (e) {
    // console.log(`exception. didn't find the ${btnSelector} button`);
    return false;
  }
}

var agentInCall=false;

(async () => {

  const dockeroptions = ['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--disable-notifications'];
  const browser = await puppeteer.launch({
    headless: true,
    args: dockeroptions
  });
  console.log("browser launched!");

  const page = await browser.newPage();
  await page.goto('https://callstatsio.awsapps.com/connect/ccp#/', {
    waitUntil: "networkidle2"
  });
  await page.content();
  await page.waitFor(5000);
  await page.waitForSelector('#wdc_login_button');
  console.log("logging in to AC!");

  await page.type('#wdc_username', agent_name);
  await page.type('#wdc_password', agent_password);
  await page.click('#wdc_login_button');

  console.log("Agent logged in!");
  let screenshot_name = `sc-${Date.now()}.png`;
  await page.screenshot({
    path: screenshot_name
  })

  setInterval(async () => {

    if (agentInCall) {
      return;
    }

    let isIncoming = await chkForButton(page, '.connectButton');
    if (isIncoming) {
      console.log("** now I'm accepting the call!");
      await page.click('.connectButton');
      agentInCall=true
    }
  }, 5000);


  setInterval(async () => {
    // taking a screen shot
    let screenshot_name = `sc-${Date.now()}.png`;
    await page.screenshot({
      path: screenshot_name
    })

    // check if we can become available
    let isButtonVisible = await chkForButton(page, '.setAvailButton');
    if (isButtonVisible) {
      console.log("** now I'm available to take new calls!")
      await page.click('.setAvailButton');
      agentInCall=false
      return;
    }
    return;
  }, 10000);

})()