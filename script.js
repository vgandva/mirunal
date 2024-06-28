(function(){
    var script = {
 "scrollBarColor": "#000000",
 "gap": 10,
 "scripts": {
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "registerKey": function(key, value){  window[key] = value; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getKey": function(key){  return window[key]; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "existsKey": function(key){  return key in window; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "unregisterKey": function(key){  delete window[key]; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); }
 },
 "horizontalAlign": "left",
 "data": {
  "name": "Player1725"
 },
 "children": [
  "this.MainViewer",
  "this.IconButton_4880D655_5A27_1113_41BF_F3758082CA0F"
 ],
 "id": "rootPlayer",
 "defaultVRPointer": "laser",
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_4880D655_5A27_1113_41BF_F3758082CA0F], 'cardboardAvailable')",
 "paddingBottom": 0,
 "verticalAlign": "top",
 "downloadEnabled": false,
 "width": "100%",
 "mouseWheelEnabled": true,
 "class": "Player",
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "borderRadius": 0,
 "shadow": false,
 "definitions": [{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_50345720_5D3A_1075_41D6_DBB7403C7EDE",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 7.21,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_503B172D_5D3A_104F_41CC_FDBE20B5D4D4",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 16.13,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_5021E73A_5D3A_1055_41D1_3D2C6B403FE3",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 134.77,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_533B760B_5D3A_104B_41D6_788AA642B4CD",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.79,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "master bed room 2",
 "id": "panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -81.51,
   "panorama": "this.panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8",
   "yaw": 132.02,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -8.34,
   "panorama": "this.panorama_5700382B_5A65_7137_41CF_8F89041F2CEA",
   "yaw": -164.06,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_55BB2BC8_5A2F_1771_41D3_991D65B3425D",
  "this.overlay_55CF3500_5A2D_70F1_41D0_401B7A56B6A3"
 ]
},
{
 "hfov": 360,
 "label": "garden 1",
 "id": "panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 169.26,
   "panorama": "this.panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555",
   "yaw": -85.21,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -172.54,
   "panorama": "this.panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303",
   "yaw": 40.46,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -79.96,
   "panorama": "this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A",
   "yaw": -6.78,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -111.98,
   "panorama": "this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB",
   "yaw": 70.11,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_F7B9E53B_E792_25B7_4190_AFED49B5F475",
  "this.overlay_E85CDBAA_E796_2D51_41D9_7851E7B9A965",
  "this.overlay_F7DC4B8A_E796_6D51_41D9_CD4D4EC60D2D",
  "this.overlay_54BE24D5_5A1D_7113_416E_1C5D17EC8D75"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_50B797B8_5D3A_1056_41D1_7D0C913C75E2",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -77.59,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "dining",
 "id": "panorama_EC708D2B_E776_2557_41B5_61E5499179BB",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 70.11,
   "panorama": "this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4",
   "yaw": -111.98,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -83.99,
   "panorama": "this.panorama_ED8BD225_E776_1F53_41DF_DA89187B1344",
   "yaw": 102.41,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -62.84,
   "panorama": "this.panorama_EC768707_E776_655F_41E2_07F6134F2330",
   "yaw": 44.31,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_E8180CEB_E792_24D7_41AC_0F402FBF7301",
  "this.overlay_F7E4DE3E_E792_27B1_41D5_F86E7F3B6787",
  "this.overlay_F7194167_E792_1DDF_41E7_BE602AEEF489",
  "this.overlay_F75065DE_E7F2_E4F1_41C4_C7724E62B1B5"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_50630784_5D3A_103D_41CD_EC596BB71326",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.64,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_5014474B_5D3A_10CB_41D3_D86F1D5E460C",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -47.98,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "walkin wadrobe room 2",
 "id": "panorama_EC70518D_E776_1D53_41C0_B5707D869845",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -163.87,
   "panorama": "this.panorama_EC768707_E776_655F_41E2_07F6134F2330",
   "yaw": -161.4,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_F504D51B_E7F2_2577_41E4_E794B5C277E1"
 ]
},
{
 "hfov": 360,
 "label": "kitchen",
 "id": "panorama_ED8BD225_E776_1F53_41DF_DA89187B1344",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 102.41,
   "panorama": "this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB",
   "yaw": -83.99,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_EC768707_E776_655F_41E2_07F6134F2330"
  }
 ],
 "thumbnailUrl": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_F777B9C4_E7F6_2CD1_41D2_178512F24484",
  "this.overlay_4E29FE2D_5AE5_7133_41CA_03A0ED87933B"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_5435E64F_5A65_110F_4188_E630CABB19DB_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51D276F3_5D3A_11DB_41B3_B3E231376196",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 115.64,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_5317A62B_5D3A_104B_41D4_FB0978329327",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -10.74,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_530E864A_5D3A_1035_41C5_41471CAED396",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 100.04,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51F5D6A7_5D3A_107B_4195_0F92D1ACCD57",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -135.69,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "Gym",
 "id": "panorama_5435E64F_5A65_110F_4188_E630CABB19DB",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -172.79,
   "panorama": "this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A",
   "yaw": -87.44,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_4BB2BF10_5A2D_0F11_41D1_1A24FA221A93"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_531A4638_5D3A_1055_41D6_31615401B22E",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 7.46,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_500FA76A_5D3A_10F5_4193_27121885A13A",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.01,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_507EA777_5D3A_10DB_41B6_6274AC25A821",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 117.16,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_50520795_5D3A_105F_41C6_527A927CF03B",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -139.54,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51D8F700_5D3A_1035_41D5_0D3D78BCC194",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 98.49,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "hall",
 "id": "panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -6.78,
   "panorama": "this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4",
   "yaw": -79.96,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 172.14,
   "panorama": "this.panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7",
   "yaw": -43.84,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -87.44,
   "panorama": "this.panorama_5435E64F_5A65_110F_4188_E630CABB19DB",
   "yaw": -172.79,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -64.36,
   "panorama": "this.panorama_5700382B_5A65_7137_41CF_8F89041F2CEA",
   "yaw": -5.94,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_540A28EE_5A25_1131_41D6_11F962326F5A",
  "this.overlay_555EA88A_5A27_11F1_41C8_DF7131C9F995",
  "this.overlay_49C38621_5A2D_3133_41D3_20D6E65C041B",
  "this.overlay_48D3AFB7_5A2D_0F1F_41A7_86C3B2899004"
 ]
},
{
 "hfov": 360,
 "label": "walkinwardrobe2",
 "id": "panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -45.23,
   "panorama": "this.panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107",
   "yaw": 29.65,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 132.02,
   "panorama": "this.panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91",
   "yaw": -81.51,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_55C4AAEA_5A23_1131_41D3_34DE154444CB",
  "this.overlay_4F0290DA_5AE3_1111_41B2_0153813708D5"
 ]
},
{
 "class": "PanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "buttonCardboardView": "this.IconButton_4880D655_5A27_1113_41BF_F3758082CA0F",
 "touchControlMode": "drag_rotation"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_5188D693_5D3A_105B_41A8_3917571D5D78",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 136.16,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "livingroom 1",
 "id": "panorama_ECB59212_E772_1F71_41D3_682247336567",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -83.36,
   "panorama": "this.panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555",
   "yaw": 92.14,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4"
  }
 ],
 "thumbnailUrl": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_EAD0E595_E77E_6573_41D7_D204BF064ABD"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51CE0710_5D3A_1055_41D4_76A3AF977D4C",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 171.66,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_50A6E7C7_5D3A_103B_41BA_2F5A0CC2611D",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 174.06,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_EC768707_E776_655F_41E2_07F6134F2330_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_5018B758_5D3A_10D5_41B2_17A89346A384",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -109.89,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_ECB59212_E772_1F71_41D3_682247336567_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "Bed Room 2",
 "id": "panorama_EC768707_E776_655F_41E2_07F6134F2330",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 44.31,
   "panorama": "this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB",
   "yaw": -62.84,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -161.4,
   "panorama": "this.panorama_EC70518D_E776_1D53_41C0_B5707D869845",
   "yaw": -163.87,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_F6F0F528_E7F6_2551_41DC_5157C9540DBA",
  "this.overlay_F6CCE433_E7F6_3BB7_41E3_A83ACF60039E"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_53710659_5D3A_10D7_41C2_80CA5EC6E02B",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 68.02,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_EC708D2B_E776_2557_41B5_61E5499179BB_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51F156B4_5D3A_105D_41CB_86CCD1ADC447",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 18.6,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "walkinwardrobe 2v2",
 "id": "panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 29.65,
   "panorama": "this.panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8",
   "yaw": -45.23,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_4BFFE0EE_5A23_3131_41CC_6E0868A733B3",
  "this.overlay_4F13CF97_5AFF_0F1F_4195_F396F8C4D40E"
 ]
},
{
 "hfov": 360,
 "label": "Home theater ",
 "id": "panorama_5700382B_5A65_7137_41CF_8F89041F2CEA",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -5.94,
   "panorama": "this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A",
   "yaw": -64.36,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -164.06,
   "panorama": "this.panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91",
   "yaw": -8.34,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_48D4E924_5A2F_1331_41C7_27CC5336BAC3",
  "this.overlay_481C9531_5A2F_3313_41C5_69DBF169C765"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "living room 2",
 "id": "panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -85.21,
   "panorama": "this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4",
   "yaw": 169.26,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 92.14,
   "panorama": "this.panorama_ECB59212_E772_1F71_41D3_682247336567",
   "yaw": -83.36,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_E830CA88_E792_2F52_41E7_0D70B7453303",
  "this.overlay_E8046160_E792_3DD1_4189_1D5F2B2C8F78"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51ECC6E0_5D3A_11F5_41D3_452F6A63E4F1",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.56,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_504487A7_5D3A_107B_41B4_AC9BCC19AA55",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -150.35,
  "pitch": 0
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_ECB59212_E772_1F71_41D3_682247336567",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_ECB59212_E772_1F71_41D3_682247336567_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_ED8BD225_E776_1F53_41DF_DA89187B1344",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_EC768707_E776_655F_41E2_07F6134F2330",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_EC768707_E776_655F_41E2_07F6134F2330_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_EC70518D_E776_1D53_41C0_B5707D869845",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_EC70518D_E776_1D53_41C0_B5707D869845_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_5435E64F_5A65_110F_4188_E630CABB19DB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5435E64F_5A65_110F_4188_E630CABB19DB_camera"
  },
  {
   "class": "PanoramaPlayListItem",
   "media": "this.panorama_5700382B_5A65_7137_41CF_8F89041F2CEA",
   "end": "this.trigger('tourEnded')",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_camera"
  }
 ],
 "id": "mainPlayList"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51FB66C6_5D3A_103D_41CA_3107AB3D064C",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 173.22,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_51E476D3_5D3A_11DB_41C7_74F5CFD806EB",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -7.86,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_50AB57E3_5D3A_1FFB_41D1_B9E7356A9E70",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 15.94,
  "pitch": 0
 }
},
{
 "hfov": 360,
 "label": "Bed room 2(G+1)",
 "id": "panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -43.84,
   "panorama": "this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A",
   "yaw": 172.14,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_4BABE302_5A22_F0F1_41D1_A8462BD111D2"
 ]
},
{
 "hfov": 360,
 "label": "bed room 1",
 "id": "panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303",
 "vfov": 180,
 "pitch": 0,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/f/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/u/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/r/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/b/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/d/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "rowCount": 6,
      "colCount": 6,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 3072
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "colCount": 3,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1536
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "colCount": 2,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "height": 1024
     },
     {
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "colCount": 1,
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_0/l/3/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_t.jpg"
  }
 ],
 "class": "Panorama",
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 40.46,
   "panorama": "this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4",
   "yaw": -172.54,
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_t.jpg",
 "hfovMax": 130,
 "hfovMin": "120%",
 "overlays": [
  "this.overlay_F55BC11E_E7F2_1D71_41E5_A7881912F23A"
 ]
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_532EF619_5D3A_1057_41C4_17A0D5F034C7",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.86,
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_EC70518D_E776_1D53_41C0_B5707D869845_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 }
},
{
 "toolTipShadowColor": "#333333",
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "left": 0,
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "width": "100%",
 "playbackBarBackgroundColorDirection": "vertical",
 "class": "ViewerArea",
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowOpacity": 1,
 "toolTipFontFamily": "Arial",
 "toolTipFontStyle": "normal",
 "shadow": false,
 "playbackBarBorderRadius": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "toolTipTextShadowOpacity": 0,
 "height": "100%",
 "propagateClick": false,
 "paddingRight": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "toolTipFontColor": "#606060",
 "playbackBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarProgressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "borderSize": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipPaddingRight": 6,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "progressBackgroundOpacity": 1,
 "toolTipBorderSize": 1,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "minWidth": 100,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "displayTooltipInTouchScreens": true,
 "bottom": 0,
 "progressBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "playbackBarLeft": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "transitionDuration": 500,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipBorderColor": "#767676",
 "paddingLeft": 0,
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "progressBarBorderColor": "#000000",
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipFontSize": "1.11vmin",
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBorderColor": "#000000",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipTextShadowBlurRadius": 3,
 "data": {
  "name": "Main Viewer"
 },
 "toolTipPaddingBottom": 4
},
{
 "verticalAlign": "middle",
 "borderSize": 0,
 "horizontalAlign": "center",
 "id": "IconButton_4880D655_5A27_1113_41BF_F3758082CA0F",
 "width": 42,
 "paddingBottom": 0,
 "right": "2.59%",
 "class": "IconButton",
 "maxWidth": 42,
 "backgroundOpacity": 0,
 "iconURL": "skin/IconButton_4880D655_5A27_1113_41BF_F3758082CA0F.png",
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "4.84%",
 "mode": "push",
 "height": 43,
 "shadow": false,
 "maxHeight": 43,
 "propagateClick": false,
 "paddingRight": 0,
 "minHeight": 1,
 "paddingLeft": 0,
 "transparencyActive": false,
 "cursor": "hand",
 "paddingTop": 0,
 "data": {
  "name": "IconButton13821"
 }
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D62B115_5A25_1313_41CC_56AD046F9B79",
   "yaw": -164.06,
   "pitch": -9.94,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 14.4
  }
 ],
 "id": "overlay_55BB2BC8_5A2F_1771_41D3_991D65B3425D",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 14.4,
   "yaw": -164.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -9.94
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5700382B_5A65_7137_41CF_8F89041F2CEA, this.camera_51CE0710_5D3A_1055_41D4_76A3AF977D4C); this.mainPlayList.set('selectedIndex', 14)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D625115_5A25_1313_41C1_721C31941998",
   "yaw": 132.02,
   "pitch": -2.87,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.28
  }
 ],
 "id": "overlay_55CF3500_5A2D_70F1_41D0_401B7A56B6A3",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.28,
   "yaw": 132.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -2.87
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8, this.camera_51D8F700_5D3A_1035_41D5_0D3D78BCC194); this.mainPlayList.set('selectedIndex', 10)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56EC9D6_E7FE_2CFE_41CE_20396512DA44",
   "yaw": -85.21,
   "pitch": -30.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 15.96
  }
 ],
 "id": "overlay_F7B9E53B_E792_25B7_4190_AFED49B5F475",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 15.96,
   "yaw": -85.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_1_HS_0_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -30.53
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555, this.camera_5317A62B_5D3A_104B_41D4_FB0978329327); this.mainPlayList.set('selectedIndex', 1)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56EB9D6_E7FE_2CFE_41D5_84CCFC5D77E9",
   "yaw": 70.11,
   "pitch": -25.1,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 16.78
  }
 ],
 "id": "overlay_E85CDBAA_E796_2D51_41D9_7851E7B9A965",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 16.78,
   "yaw": 70.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_1_HS_1_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -25.1
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB, this.camera_53710659_5D3A_10D7_41C2_80CA5EC6E02B); this.mainPlayList.set('selectedIndex', 3)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56E49D6_E7FE_2CFE_41A1_8E081C6B4BA6",
   "yaw": 40.46,
   "pitch": -3.76,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.27
  }
 ],
 "id": "overlay_F7DC4B8A_E796_6D51_41D9_CD4D4EC60D2D",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.27,
   "yaw": 40.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -3.76
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303, this.camera_531A4638_5D3A_1055_41D6_31615401B22E); this.mainPlayList.set('selectedIndex', 7)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0_HS_3_0.png",
      "width": 801,
      "height": 477
     }
    ]
   },
   "pitch": 17.49,
   "hfov": 33.61,
   "yaw": -6.78
  }
 ],
 "id": "overlay_54BE24D5_5A1D_7113_416E_1C5D17EC8D75",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 33.61,
   "yaw": -6.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_0_HS_3_0_0_map.gif",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": 17.49
  }
 ],
 "data": {
  "label": "Image"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A, this.camera_530E864A_5D3A_1035_41C5_41471CAED396); this.mainPlayList.set('selectedIndex', 8)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56E39D6_E7FE_2CFE_41E4_35DEBF093F53",
   "yaw": -111.98,
   "pitch": -24.97,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 16.8
  }
 ],
 "id": "overlay_E8180CEB_E792_24D7_41AC_0F402FBF7301",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 16.8,
   "yaw": -111.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_1_HS_0_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -24.97
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4, this.camera_5018B758_5D3A_10D5_41B2_17A89346A384); this.mainPlayList.set('selectedIndex', 2)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56199D6_E7FE_2CFE_41E1_EA88C97C2822",
   "yaw": -88.16,
   "pitch": 1.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.29
  }
 ],
 "id": "overlay_F7E4DE3E_E792_27B1_41D5_F86E7F3B6787",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.29,
   "yaw": -88.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.39
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 7)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56159D6_E7FE_2CFE_41B7_BA76CEEECC67",
   "yaw": 44.31,
   "pitch": 4.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.27
  }
 ],
 "id": "overlay_F7194167_E792_1DDF_41E7_BE602AEEF489",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.27,
   "yaw": 44.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.41
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC768707_E776_655F_41E2_07F6134F2330, this.camera_507EA777_5D3A_10DB_41B6_6274AC25A821); this.mainPlayList.set('selectedIndex', 5)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D96B5DC_5AE7_3311_41AA_CD569F8DD10D",
   "yaw": 102.41,
   "pitch": -22.07,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 15.43
  }
 ],
 "id": "overlay_F75065DE_E7F2_E4F1_41C4_C7724E62B1B5",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 15.43,
   "yaw": 102.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0_HS_3_0_0_map.gif",
      "width": 61,
      "height": 16
     }
    ]
   },
   "pitch": -22.07
  }
 ],
 "data": {
  "label": "Circle 03c"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_ED8BD225_E776_1F53_41DF_DA89187B1344, this.camera_500FA76A_5D3A_10F5_4193_27121885A13A); this.mainPlayList.set('selectedIndex', 4)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56139D6_E7FE_2CFE_41D5_297E740348D9",
   "yaw": -161.4,
   "pitch": -1.29,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.29
  }
 ],
 "id": "overlay_F504D51B_E7F2_2577_41E4_E794B5C277E1",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.29,
   "yaw": -161.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.29
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC768707_E776_655F_41E2_07F6134F2330, this.camera_503B172D_5D3A_104F_41CC_FDBE20B5D4D4); this.mainPlayList.set('selectedIndex', 5)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F560E9D6_E7FE_2CFE_41E5_EE9911B111E3",
   "yaw": -70.04,
   "pitch": -1.49,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.29
  }
 ],
 "id": "overlay_F777B9C4_E7F6_2CD1_41D2_178512F24484",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.29,
   "yaw": -70.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.49
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 5)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4E0B3A93_5AE5_1117_41CA_B4AAC752C284",
   "yaw": -83.99,
   "pitch": -22.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 9.52
  }
 ],
 "id": "overlay_4E29FE2D_5AE5_7133_41CA_03A0ED87933B",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 9.52,
   "yaw": -83.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0_HS_2_0_0_map.gif",
      "width": 36,
      "height": 16
     }
    ]
   },
   "pitch": -22.96
  }
 ],
 "data": {
  "label": "Circle 03c"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB, this.camera_50B797B8_5D3A_1056_41D1_7D0C913C75E2); this.mainPlayList.set('selectedIndex', 3)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D60411D_5A25_1313_41D3_AED89A9AECD2",
   "yaw": -87.44,
   "pitch": -5.47,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 14.89
  }
 ],
 "id": "overlay_4BB2BF10_5A2D_0F11_41D1_1A24FA221A93",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 14.89,
   "yaw": -87.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -5.47
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A, this.camera_50345720_5D3A_1075_41D6_DBB7403C7EDE); this.mainPlayList.set('selectedIndex', 8)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D63E114_5A25_1311_41D4_8A3981D2064E",
   "yaw": -43.84,
   "pitch": -13.35,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 15.09
  }
 ],
 "id": "overlay_540A28EE_5A25_1131_41D6_11F962326F5A",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 15.09,
   "yaw": -43.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -13.35
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7, this.camera_51E476D3_5D3A_11DB_41C7_74F5CFD806EB); this.mainPlayList.set('selectedIndex', 12)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_1_0.png",
      "width": 557,
      "height": 426
     }
    ]
   },
   "pitch": -41.32,
   "hfov": 18.4,
   "yaw": -79.96
  }
 ],
 "id": "overlay_555EA88A_5A27_11F1_41C8_DF7131C9F995",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 18.4,
   "yaw": -79.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_1_0_0_map.gif",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": -41.32
  }
 ],
 "data": {
  "label": "Image"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4, this.camera_51FB66C6_5D3A_103D_41CA_3107AB3D064C); this.mainPlayList.set('selectedIndex', 2)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D635115_5A25_1313_41D4_9F9CBFB2B169",
   "yaw": -5.94,
   "pitch": -3.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.28
  }
 ],
 "id": "overlay_49C38621_5A2D_3133_41D3_20D6E65C041B",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.28,
   "yaw": -5.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -3.28
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5700382B_5A65_7137_41CF_8F89041F2CEA, this.camera_51D276F3_5D3A_11DB_41B3_B3E231376196); this.mainPlayList.set('selectedIndex', 14)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D630115_5A25_1313_41CA_D370F5ADDFAA",
   "yaw": -172.79,
   "pitch": 0.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 19.35
  }
 ],
 "id": "overlay_48D3AFB7_5A2D_0F1F_41A7_86C3B2899004",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 19.35,
   "yaw": -172.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.58
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5435E64F_5A65_110F_4188_E630CABB19DB, this.camera_51ECC6E0_5D3A_11F5_41D3_452F6A63E4F1); this.mainPlayList.set('selectedIndex', 13)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D61F11B_5A25_1317_41CA_3A0E5801D381",
   "yaw": -81.51,
   "pitch": 2.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 15.78
  }
 ],
 "id": "overlay_55C4AAEA_5A23_1131_41D3_34DE154444CB",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 15.78,
   "yaw": -81.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 2.09
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91, this.camera_5014474B_5D3A_10CB_41D3_D86F1D5E460C); this.mainPlayList.set('selectedIndex', 9)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4E0A6A98_5AE5_1111_41C5_B8963A092A7C",
   "yaw": 29.65,
   "pitch": -50.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 8.23
  }
 ],
 "id": "overlay_4F0290DA_5AE3_1111_41B2_0153813708D5",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 8.23,
   "yaw": 29.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0_HS_3_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -50.84
  }
 ],
 "data": {
  "label": "Circle 02a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107, this.camera_5021E73A_5D3A_1055_41D1_3D2C6B403FE3); this.mainPlayList.set('selectedIndex', 11)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56C99C7_E7FE_2CDF_41C8_D0DB18C712F7",
   "yaw": 92.14,
   "pitch": -26.2,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 16.63
  }
 ],
 "id": "overlay_EAD0E595_E77E_6573_41D7_D204BF064ABD",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 16.63,
   "yaw": 92.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_1_HS_0_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -26.2
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 2); this.mainPlayList.set('selectedIndex', 1)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56009D6_E7FE_2CFE_41E7_6D5F12017178",
   "yaw": -62.84,
   "pitch": -7.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.21
  }
 ],
 "id": "overlay_F6F0F528_E7F6_2551_41DC_5157C9540DBA",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.21,
   "yaw": -62.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -7.4
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC708D2B_E776_2557_41B5_61E5499179BB, this.camera_51F5D6A7_5D3A_107B_4195_0F92D1ACCD57); this.mainPlayList.set('selectedIndex', 3)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F563C9D6_E7FE_2CFE_41E3_3FD2FE37311C",
   "yaw": -163.87,
   "pitch": -7.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.22
  }
 ],
 "id": "overlay_F6CCE433_E7F6_3BB7_41E3_A83ACF60039E",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.22,
   "yaw": -163.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -7.12
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC70518D_E776_1D53_41C0_B5707D869845, this.camera_51F156B4_5D3A_105D_41CB_86CCD1ADC447); this.mainPlayList.set('selectedIndex', 6)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D60D11C_5A25_1311_41D4_31FF13BA5240",
   "yaw": -29.34,
   "pitch": -1.29,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 17.98
  }
 ],
 "id": "overlay_4BFFE0EE_5A23_3131_41CC_6E0868A733B3",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 17.98,
   "yaw": -29.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.29
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 9)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4DAFD20A_5AFD_30F1_41D2_869DBE3AB94F",
   "yaw": -45.23,
   "pitch": -53.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 9.78
  }
 ],
 "id": "overlay_4F13CF97_5AFF_0F1F_4195_F396F8C4D40E",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 9.78,
   "yaw": -45.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0_HS_5_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -53.93
  }
 ],
 "data": {
  "label": "Circle 02a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8, this.camera_504487A7_5D3A_107B_41B4_AC9BCC19AA55); this.mainPlayList.set('selectedIndex', 10)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D67F11D_5A25_1313_41C6_F72030EB2FF3",
   "yaw": -8.34,
   "pitch": -7.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 14.85
  }
 ],
 "id": "overlay_48D4E924_5A2F_1331_41C7_27CC5336BAC3",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 14.85,
   "yaw": -8.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -7.09
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91, this.camera_50AB57E3_5D3A_1FFB_41D1_B9E7356A9E70); this.mainPlayList.set('selectedIndex', 9)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D67911D_5A25_1313_41D6_938592245DA4",
   "yaw": -64.36,
   "pitch": -4.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 14.36
  }
 ],
 "id": "overlay_481C9531_5A2F_3313_41C5_69DBF169C765",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 14.36,
   "yaw": -64.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -4.79
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A, this.camera_50A6E7C7_5D3A_103B_41BA_2F5A0CC2611D); this.mainPlayList.set('selectedIndex', 8)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56FA9D6_E7FE_2CFE_41E5_9867947B661B",
   "yaw": -83.36,
   "pitch": -31.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 15.79
  }
 ],
 "id": "overlay_E830CA88_E792_2F52_41E7_0D70B7453303",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 15.79,
   "yaw": -83.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_1_HS_0_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -31.56
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_ECB59212_E772_1F71_41D3_682247336567, this.camera_532EF619_5D3A_1057_41C4_17A0D5F034C7); this.mainPlayList.set('selectedIndex', 0)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F56F19D6_E7FE_2CFE_41E9_41BE21EA46FC",
   "yaw": 169.26,
   "pitch": -26.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 11.88
  }
 ],
 "id": "overlay_E8046160_E792_3DD1_4189_1D5F2B2C8F78",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 11.88,
   "yaw": 169.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_1_HS_1_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -26.24
  }
 ],
 "data": {
  "label": "Circle 03a"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4, this.camera_533B760B_5D3A_104B_41D6_788AA642B4CD); this.mainPlayList.set('selectedIndex', 2)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4D60A11C_5A25_1311_4184_9252A225799E",
   "yaw": 172.14,
   "pitch": -1.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 15.71
  }
 ],
 "id": "overlay_4BABE302_5A22_F0F1_41D1_A8462BD111D2",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 15.71,
   "yaw": 172.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.27
  }
 ],
 "data": {
  "label": "Circle Door 01"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A, this.camera_5188D693_5D3A_105B_41A8_3917571D5D78); this.mainPlayList.set('selectedIndex', 8)"
  }
 ]
},
{
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_F560E9D6_E7FE_2CFE_41D7_5330AE614436",
   "yaw": -172.54,
   "pitch": -4.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100,
   "hfov": 10.26
  }
 ],
 "id": "overlay_F55BC11E_E7F2_1D71_41E5_A7881912F23A",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "hfov": 10.26,
   "yaw": -172.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -4.58
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4, this.camera_50520795_5D3A_105F_41C6_527A927CF03B); this.mainPlayList.set('selectedIndex', 2)"
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D62B115_5A25_1313_41CC_56AD046F9B79",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D625115_5A25_1313_41C1_721C31941998",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_576D8F48_5A1F_0F71_41B3_9DE488C30D91_1_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56EC9D6_E7FE_2CFE_41CE_20396512DA44",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_1_HS_0_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56EB9D6_E7FE_2CFE_41D5_84CCFC5D77E9",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_1_HS_1_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56E49D6_E7FE_2CFE_41A1_8E081C6B4BA6",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC7C320F_E776_1F6E_41D7_B37E996656F4_1_HS_2_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56E39D6_E7FE_2CFE_41E4_35DEBF093F53",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_1_HS_0_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56199D6_E7FE_2CFE_41E1_EA88C97C2822",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_1_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56159D6_E7FE_2CFE_41B7_BA76CEEECC67",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_1_HS_2_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D96B5DC_5AE7_3311_41AA_CD569F8DD10D",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC708D2B_E776_2557_41B5_61E5499179BB_0_HS_3_0.png",
   "width": 1080,
   "height": 420
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56139D6_E7FE_2CFE_41D5_297E740348D9",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC70518D_E776_1D53_41C0_B5707D869845_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F560E9D6_E7FE_2CFE_41E5_EE9911B111E3",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4E0B3A93_5AE5_1117_41CA_B4AAC752C284",
 "frameCount": 20,
 "rowCount": 5,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_ED8BD225_E776_1F53_41DF_DA89187B1344_0_HS_2_0.png",
   "width": 1080,
   "height": 600
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D60411D_5A25_1313_41D3_AED89A9AECD2",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_5435E64F_5A65_110F_4188_E630CABB19DB_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D63E114_5A25_1311_41D4_8A3981D2064E",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D635115_5A25_1313_41D4_9F9CBFB2B169",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_2_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D630115_5A25_1313_41CA_D370F5ADDFAA",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_54631AA5_5A6D_3133_41C3_13F808D6E34A_1_HS_3_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D61F11B_5A25_1317_41CA_3A0E5801D381",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4E0A6A98_5AE5_1111_41C5_B8963A092A7C",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_5635B116_5A1F_3311_41CC_5A2FA84D7BE8_0_HS_3_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56C99C7_E7FE_2CDF_41C8_D0DB18C712F7",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_ECB59212_E772_1F71_41D3_682247336567_1_HS_0_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56009D6_E7FE_2CFE_41E7_6D5F12017178",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F563C9D6_E7FE_2CFE_41E3_3FD2FE37311C",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC768707_E776_655F_41E2_07F6134F2330_1_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D60D11C_5A25_1311_41D4_31FF13BA5240",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_1_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4DAFD20A_5AFD_30F1_41D2_869DBE3AB94F",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_5618BDA6_5A1F_3331_41C9_F7177F2C2107_0_HS_5_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D67F11D_5A25_1313_41C6_F72030EB2FF3",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D67911D_5A25_1313_41D6_938592245DA4",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_5700382B_5A65_7137_41CF_8F89041F2CEA_1_HS_1_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56FA9D6_E7FE_2CFE_41E5_9867947B661B",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_1_HS_0_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F56F19D6_E7FE_2CFE_41E9_41BE21EA46FC",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_EC77ECE1_E771_E4D3_41DD_56BAA9E53555_1_HS_1_0.png",
   "width": 1080,
   "height": 900
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_4D60A11C_5A25_1311_4184_9252A225799E",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_561A9AF3_5A1F_1117_41C9_B8C4F88763C7_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "id": "AnimatedImageResource_F560E9D6_E7FE_2CFE_41D7_5330AE614436",
 "frameCount": 24,
 "rowCount": 6,
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_ED8ECBBB_E776_2CB7_41DE_EB8432ADD303_1_HS_0_0.png",
   "width": 800,
   "height": 1200
  }
 ],
 "frameDuration": 41,
 "colCount": 4
}],
 "propagateClick": false,
 "height": "100%",
 "desktopMipmappingEnabled": false,
 "mobileMipmappingEnabled": false,
 "paddingRight": 0,
 "minHeight": 20,
 "scrollBarOpacity": 0.5,
 "vrPolyfillScale": 0.89,
 "paddingLeft": 0,
 "overflow": "visible",
 "contentOpaque": false,
 "borderSize": 0,
 "paddingTop": 0,
 "layout": "absolute",
 "backgroundPreloadEnabled": true,
 "scrollBarVisible": "rollOver"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
