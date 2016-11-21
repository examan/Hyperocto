/* global enumerationBuilder, MESSAGETYPE, GETMODE */

'use strict'

const CONTEXTMENUIDLIST = ['OPEN_ALL', 'OPEN_FOLLOWING']
const CONTEXTMENU = enumerationBuilder(CONTEXTMENUIDLIST)
/*
  Prevent Error in non-persistent mode: Cannot create item with duplicate id.
  browser.runtime.onInstalled.addListener is the better solution in non-persistent mode.
  Currently Firefox doesn't support non-persistent mode.
  https://developer.mozilla.org/zh-TW/Add-ons/WebExtensions/Chrome_incompatibilities#background
*/
browser.contextMenus.removeAll().then(() => {
  CONTEXTMENUIDLIST.forEach(menuItemId => {
    browser.contextMenus.create({
      id: menuItemId,
      title: browser.i18n.getMessage(`CONTEXTMENU_${menuItemId}`),
      contexts: ['link']
    })
  })
})

browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case CONTEXTMENU.OPEN_FOLLOWING:
    case CONTEXTMENU.OPEN_ALL:
      let mode = (info.menuItemId === CONTEXTMENU.OPEN_FOLLOWING ? GETMODE.FOLLOWING : GETMODE.NONE)

      browser.tabs.sendMessage(
        tab.id,
        {
          'type': MESSAGETYPE.GETLINKS,
          'mode': mode
        },
        {
          frameId: info.frameId
        }
      )
      break
  }
})

function messageOpenLinksHandler (message, sender, sendResponse) {
  message.urls.forEach((url, index) => {
    let param = {
      'url': url,
      'index': sender.tab.index + index + 1,
      'active': false
    }

    setTimeout(() => {
      browser.tabs.create(param).then(tab => {
        browser.tabs.sendMessage(
          sender.tab.id,
          {
            'type': MESSAGETYPE.TABOPENED,
            'tabId': tab.id
          },
          {
            frameId: sender.frameId
          }
        )
      })
    }, 0)
  })
}

function messageSetOpenedTabCountHandler (message, sender, sendResponse) {
  /*
  TODO: complete this function, currently the polyfill doesn't work correctly for pageAction.hide/pageAction.show

  let tabId = sender.tab.id
  let count = message.count

  if (count === 0) {
    browser.pageAction.hide(tabId)
  } else {
    browser.pageAction.show(tabId)
  }
  */
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGETYPE.OPENLINKS:
      messageOpenLinksHandler.call(this, message, sender, sendResponse)
      break
    case MESSAGETYPE.SETOPENEDTABCOUNT:
      messageSetOpenedTabCountHandler.call(this, message, sender, sendResponse)
      break
  }

  return true
})
