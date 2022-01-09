function getAccessToken() {
  const url = 'https://auth-integration.servicetitan.io/connect/token'
  const client_id = '';
  const client_secret = '';

  const data = {
    'grant_type': 'client_credentials',
    'client_id': client_id,
    'client_secret': client_secret
  };

  const options = {
    'method': 'post',
    'mutehttpexceptions': true,
    'contentType': 'application/x-www-form-urlencoded',
    'payload': data
  };

  const accessToken = UrlFetchApp.fetch(url, options);

  return JSON.parse(accessToken).access_token
}


function buildHeader(accessToken, appKey) {
  const header = {
    'authorization': accessToken,
    'ST-App-Key': appKey
  }
  return header
}


// unfinished. need to finish building all possible API endpoints for get, post, and put
function buildUrls(tenantId) {
  const urls = {
    'crm': {
      'get': {
        'leads': `https://api-integration.servicetitan.io/crm/v2/tenant/${tenantId}/leads`
      }
    },
    'dispatch': {
      'get': {
        'appt_assignments': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenantId}/appointment-assignments`,
        'tech_shifts': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenantId}/technician-shifts`
      },
      'post': {
        'appt_assignments': {
          'assign': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenantId}/appointment-assignments/assign-technicians`,
          'unassign': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenantId}/appointment-assignments/unassign-technicians`
        }
      }
    },
    'jpm': { //job planning and mamangement
      'get': {
        'appts': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenantId}/appointments`,
        'job_cancel_reasons': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenantId}/job-cancel-reasons`,
        'job_hold_reasons': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenantId}/job-hold-reasons`,
        'jobs': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenantId}/jobs`
      },
      'post': {
        'appts': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenantId}/appointments`,
        'jobs': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenantId}/jobs`
      }
    },
    'marketing': {
      'get': {
        'campaigns': `https://api-integration.servicetitan.io/marketing/v2/tenant/${tenantId}/campaigns`
      }
    },
    'memberships': {
      'get': {
        'memberships': `https://api-integration.servicetitan.io/memberships/v2/tenant/${tenantId}/memberships`
      }
    }
  }

  return urls
}


function convertJSONto2dArray(json) {
  const data = json.data
  let header = [];
  let arr = [];

  data.forEach(obj => {
    Object.keys(obj).forEach(key => header.includes(key) || header.push(key))
    let thisRow = new Array(header.length);
    header.forEach((col, i) => thisRow[i] = obj[col] || '')
    arr.push(thisRow);
  })
  
  arr.unshift(header);
  Logger.log(arr);
  return arr
}


function sendDataToSpreadsheet(arr) {
  const ss = SpreadsheetApp.openById('');
  const sh = ss.getSheetByName('data');
  sh.getRange(1, 1, arr.length, arr[0].length).setValues(arr);
}


function getData() {
  const tenantId = 986291513;
  const accessToken = getAccessToken();
  const appKey = '';
  const urls = buildUrls(tenantId);

  const header = buildHeader(accessToken, appKey);

  const options = {
    "jobId": 34567,
    "start": new Date(),
    "end": new Date(),
    "arrivalWindowStart": new Date(),
    "arrivalWindowEnd": new Date(),
    "technicianIds": [123, 456],
    "specialInstructions": 'This is a fake job'
  }

  const getPayload = {
    'muteHttpExceptions': true,
    'method': 'get',
    'headers': header,
  }
  
  const postPayload = {
    'muteHttpExceptions': true,
    'method': 'post',
    'headers': header,
    'payload': options
  }

  const response = UrlFetchApp.fetch(urls.jpm.get.appts, getPayload)
  const responseData = JSON.parse(response);
  Logger.log(JSON.stringify(responseData.data, null, 2))

  //const arr = convertJSONto2dArray(responseData)

  //sendDataToSpreadsheet(arr)

}
