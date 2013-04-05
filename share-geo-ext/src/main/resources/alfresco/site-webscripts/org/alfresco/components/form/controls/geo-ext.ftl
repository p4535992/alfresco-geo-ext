<#if field.name == 'prop_ge_address'>

<div class="form-field">

<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/javascript" src="http://www.google.com/uds/api?file=uds.js&amp;v=1.0"></script>
<script type="text/javascript" src="../../../res/modules/editors/geo-ext/geo-ext.js"></script>

<div class="form-field" id="${fieldHtmlId}-field">
<label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></l
abel>
<#if form.mode == "view">
	${field.value?html}
<#else>
	<input id="${fieldHtmlId}" name="${field.name}" tabindex="0" type="text" value="${field.value?html}" />
	<input id="btnSearch" type="button" value="Find"  onclick="doSearch();" />
</#if>
<div id="outputDiv"></div>
</div>

<div style="border-width:thin; border-style:solid;">
<div id="map_canvas" style="width: 100%; height: 400px;"></div>
</div>

</div>

</#if>
