( function($) {
	var uuid=0;
	$.fn.hxDataGrid = function(options) {
		return this.each( function() {
			var $table = $(this), nowrapTD = $table.attr("nowrapTD"),gridid=$table.attr("id");
			if (!gridid)  gridid="grid"+uuid++;
			var grid = $("body").data(gridid);
			if (grid) return;
			var tlength = $table.width();
			var aStyles = [];
			var $tc = $table.parent().addClass("j-resizeGrid");
			var layoutH = $(this).attr("layoutH");var height = $(this).attr("height")||120;
			var oldThs = $table.find("thead>tr:last-child").find("th");
				if ($table.find(">tbody").length==0)
					$table.append("<tbody/>");
				for ( var i = 0, l = oldThs.size(); i < l; i++) {
					var $th = $(oldThs[i]);
					var style = [], width = $th.innerWidth()
							- (100 * $th.innerWidth() / tlength) - 2;
					style[0] = parseInt(width);
					style[1] = $th.attr("align");
					aStyles[aStyles.length] = style;
				}
				$(this).wrap("<div  id='grid"+gridid+"' class='grid'></div>");
				var $grid = $table.parent().html($table.html());
				var thead = $grid.find("thead");
				thead
						.wrap("<div class='gridHeader'><div class='gridThead'><table style='width:"
								+ (tlength - 20) + "px;' id='"+gridid+"_header'></table></div></div>");
				var $table1 = $('#'+gridid+"_header",$grid);
				var lastH = $(">tr:last-child", thead);
				var ths = $(">th", lastH);
				$("th", thead).each(
						function() {
							var $th = $(this);
							$th
									.html("<div class='gridCol' title='"
											+ $th.text() + "'>" + $th.html()
											+ "</div>");
						});
				ths.each(
						function(i) {
							var $th = $(this), style = aStyles[i];
							$th.addClass(style[1]).hoverClass("hover")
									.removeAttr("align").removeAttr("width")
									.width(style[0]);
						}).filter("[orderField]").orderBy( {
					targetType :$table.attr("targetType"),
					asc :$table.attr("asc") || "asc",
					desc :$table.attr("desc") || "desc"
				});

				var tbody = $grid.find(">tbody");
				var layoutStr = layoutH ? " layoutH='" + layoutH + "'" : "";
				
				tbody.wrap("<div class='gridScroller'" + layoutStr
						+ " style='width:" + $tc.width()
						+ "px;'><div class='gridTbody' style='height:"+height+"px'><table id="+gridid+" style='width:"
						+ (tlength - 20) + "px;'></table></div></div>");
				var $datatable=$('#'+gridid);
				$grid
						.append("<div class='resizeMarker' style='height:300px; left:57px;display:none;'></div><div class='resizeProxy' style='height:300px; left:377px;display:none;'></div>");

				var scroller = $(".gridScroller", $grid);
				scroller.scroll( function(event) {
					var header = $(".gridThead", $grid);
					if (scroller.scrollLeft() > 0) {
						header.css("position", "relative");
						var scroll = scroller.scrollLeft();
						header.css("left", scroller.cssv("left") - scroll);
					}
					if (scroller.scrollLeft() == 0) {
						header.css("position", "relative");
						header.css("left", "0px");
					}
					return false;
				});
				var ftr = $("tr:first-child", $datatable);
				tbodyinit($datatable,aStyles);
				$(">tr", thead)
						.each(
								function() {

									$(">th", this)
											.each(
													function(i) {
														var th = this, $th = $(this);
														$th
																.mouseover( function(
																		event) {
																	var offset = $.hxDataGridTool
																			.getOffset(
																					th,
																					event).offsetX;
																	if ($th
																			.outerWidth()
																			- offset < 5) {
																		$th
																				.css(
																						"cursor",
																						"col-resize")
																				.mousedown(
																						function(
																								event) {
																							$(
																									".resizeProxy",
																									$grid)
																									.show()
																									.css(
																											{
																												left :$.hxDataGridTool
																														.getRight(th)
																														- $(
																																".gridScroller",
																																$grid)
																																.scrollLeft(),
																												top :$.hxDataGridTool
																														.getTop(th),
																												height :$.hxDataGridTool
																														.getHeight(
																																th,
																																$grid),
																												cursor :"col-resize"
																											});
																							$(
																									".resizeMarker",
																									$grid)
																									.show()
																									.css(
																											{
																												left :$.hxDataGridTool
																														.getLeft(th)
																														+ 1
																														- $(
																																".gridScroller",
																																$grid)
																																.scrollLeft(),
																												top :$.hxDataGridTool
																														.getTop(th),
																												height :$.hxDataGridTool
																														.getHeight(
																																th,
																																$grid)
																											});
																							$(
																									".resizeProxy",
																									$grid)
																									.jDrag(
																											$
																													.extend(
																															options,
																															{
																																scop :true,
																																cellMinW :20,
																																relObj :$(
																																		".resizeMarker",
																																		$grid)[0],
																																move :"horizontal",
																																event :event,
																																stop : function() {
																																	var pleft = $(
																																			".resizeProxy",
																																			$grid)
																																			.position().left;
																																	var mleft = $(
																																			".resizeMarker",
																																			$grid)
																																			.position().left;
																																	var move = pleft
																																			- mleft
																																			- $th
																																					.outerWidth()
																																			- 9;

																																	var cols = $.hxDataGridTool
																																			.getColspan($th);
																																	var cellNum = $.hxDataGridTool
																																			.getCellNum($th);
																																	var oldW = $th
																																			.width(), newW = $th
																																			.width()
																																			+ move;
																																	var $dcell = $(
																																			">td",
																																			ftr)
																																			.eq(
																																					cellNum - 1);

																																	$th
																																			.width(newW
																																					+ "px");
																																	$dcell
																																			.width(newW
																																					+ "px");
																																	aStyles[i][0] = newW;
																																	$table1
																																			.width(($table1
																																					.width()
																																					- oldW + newW)
																																					+ "px");
																																	var $table2 =$datatable;// $(
																																			// tbody)
																																			// .parent();
																																	$table2
																																			.width($table1.width());
																																	//thead.parent().parent().width($table2.width());
																																	$(
																																			".resizeMarker,.resizeProxy",
																																			$grid)
																																			.hide();
																																}
																															}));
																						});
																	} else {
																		$th
																				.css(
																						"cursor",
																						$th
																								.attr("orderField") ? "pointer"
																								: "default");
																		$th
																				.unbind("mousedown");
																	}
																	return false;
																});
													});
								});
                // 数据属性处理
				var dataurl=$table.attr("dataUrl");
				var selectid=$table.attr("selectid")||"id";
				var seltarget=$table.attr("target");
				var pageSize=$table.attr("pageSize")||20;// 定义了pageSize，表示table支持分页
				var ispage=$table.attr("ispage")||"true";
				var queryForm=$table.attr("queryForm")||"";// 定义了queryForm,queryForm的onsubmit转移到table
				var pageDiv;
				var _xmldso;
				var pageObj;
				var dataMetas;
				var immediate=$table.attr("immediate")||"true";
				if (dataurl){
					if (ispage=="true"){
						$tc.append('<div class="panelBar" id=tbpage'+gridid+'></div>');
						pageDiv=$('#tbpage'+gridid,$tc);
						if (pageSize!=20) dataurl=dataurl.appendUrl('page.pageSize',pageSize);
					}
					parseMetas();
					if (queryForm!=''){
					  var $form=$("#"+queryForm);
					  immediate=$table.attr("immediate")||"false";
					  $form.attr("action",dataurl);
					  $form.submit(function(){
						loadFormData($form);  
						return false;
					  });
					}
					if (immediate=="true"){
						if (queryForm!='') loadFormData($form);
						else loadUrlData(dataurl);
					}
					$('.refresh',$tc).click(function(){refresh();});
				}
                function refresh(){
                	var $form;
                	if (queryForm!='') $form=$("#"+queryForm);
                	else $form=_getForm("",$tc,dataurl);
                	loadFormData($form);  
                }
				function parseMetas(){
					dataMetas=[];
					$(':span[dataFld]',ftr).each(function(){
						var $span=$(this);
						var meta={};
						meta.dataFld=$span.attr("dataFld");
						meta.type=$span.attr("type")|"string";
						dataMetas.push(meta);
					});
				}
				function loadFormData(form){
					var fm=$(form);
					loadUrlData($(form).attr("action"),$(form).serializeArray());
				}
				function loadUrlData(loadurl,data){
					if (data&&paramReplace.length>0){//如果data有参数，以data为优先,去掉query的参数
						for (d in data)  loadurl=paramReplace(loadurl,data[d].name,null,true);
					}
					$.ajax({ 
					    url:loadurl, 
					    type: 'POST', 
					    data: data,
					    dataType: 'json', 
					    timeout: 50000, 
					    error: function(error){ 
					        alert('服务执行失败：'+error); 
					    }, 
					    success: function(data){ 
					       if(data.error){alert(data.message);return;}
					       pageObj=data.page;
					       addData(data);
					       _pageNav(pageObj);
					       tbodyinit($datatable,aStyles);
					       initUI($datatable);
					    } 
					}); 
					/*
					 * _xmldso = document.createElement("XML"); var Q = "xml_" +
					 * Math.random().toString().replace(/\./ig, "");
					 * _xmldso.setAttribute("id", Q); _$xmlDataSrc = "#" + Q;
					 * $datatable.attr("dataSrc",_$xmlDataSrc);
					 * $datatable.prepend(_xmldso);//insertBefore(_xmldso);
					 * _xmldso.src=dataurl; //_xmldso.async = true;
					 * _xmldso.onreadystatechange = xmldataload;
					 */
				}
				
				function addData(data){
					tbody.empty();
					$.each
					(
					 data.results,
					 function(i,row) 
					 	{
							var tr = document.createElement('tr');
							// if (i % 2 && options.striped) tr.className =
							// 'erow';
							// if (row.id) {tr.id = 'row' + row.id;
							// tr.val=row.id}
							tr.id = 'row' + (row[selectid]||i);  tr.val=row[selectid];
							// add cell
							tr.data=row;
							if (seltarget)
								tr.target=seltarget;
							//$(">tr:last th", thead)
							ths.each(
							 	function (th){
							 		// <th chkid="id"><input type="checkbox"
									// group="ids" class="checkboxCtrl"></th>
										var td = document.createElement('td');
										var dataFld=$(this).attr('field')||$(this).attr('dataFld');
										var v=row[dataFld];
										if(v === undefined) {
											try { v = eval("row."+dataFld);}
											catch (e) {}
										}
										var isbox=false;
										if ($(":checkbox",$(this)).length>0){
											isbox=true;   // <td><input
															// name="ids"
															// value="${dataMap["id"]}"
															// type="checkbox"></td>
								 		}
										
										if (v==null) v='';
										td.align = this.align;
										var opts= {rowId: tr.id,rowData:row,field:dataFld};
										if($.isFunction( this.formatter ) ) this.formatter(td,v,opts);
										else if (this.formatter) try {$(td).fmatter(this.formatter, v,opts);}catch(e){;}
										else {
											if (!isbox) td.innerHTML = v;
											else {
												var chkid=row[$(this).attr('chkid')]||row[selectid];
												var chkname=$(":checkbox",$(this)).attr("group");
												td.innerHTML = '<input name="'+chkname+'" value="'+chkid+'" type="checkbox">';
											}
										}
										//$(this).trigger("formatter");
										$(tr).append(td);
										td = null;
									}
							); 
							tbody.append(tr);
							tr = null;
						}
					);
				}
                function _pageNav(pageObj){
                	if (!pageDiv) return;
                	pageDiv.empty();
                	pageDiv.append('<div class="pages"><a class="refresh" id='+gridid+'refresh><span></span></a><span>每页显示'+pageObj.pageSize+'</span><span>条，共'+pageObj.totalCount+'条</span></div>');             	
                	pageDiv.append("<div class='pagination'></div>");
                	$('.refresh',pageDiv).click(function(){refresh();});
                	$("div.pagination", pageDiv).each(function(){
                				var $this = $(this);
                				$this.pagination({
                					targetType:"hxDatagrid",
                					rel:queryForm!=''?$('body'):$tc,//
                					action:dataurl,
                					form:queryForm,
                					totalCount:pageObj.totalCount,
                					numPerPage:pageObj.pageSize,
                					pageNumShown:10,
                					currentPage:pageObj.pageNo,
                					callback:function(form){
                					   loadFormData(form);
                				    }
                				});
                	});
				}
				function xmldataload(){
					if (_xmldso.XMLDocument.readyState != 4) return;
					if (_xmldso.XMLDocument.childNodes[1]) 
		            	if (_xmldso.XMLDocument.childNodes[1].text == "error") 
		            		alert("加载出错"+_xmldso.XMLDocument.childNodes[2].text);
		            if (_xmldso.parseError.errorCode != 0) {
		                _pageNav();
		                return
		            } else {
		            	var totalcount;
		            	var B = (String)(_xmldso.childNodes(1).nodeValue);
		            	// tbodyinit($datatable);
		            	setTimeout(function(){
		            		tbodyinit($datatable,aStyles);
						},1000);
		                _pageNav();
		            }
				}
				function _resizeGrid() {
					$("div.j-resizeGrid").each( function() {
						var width = $(this).innerWidth();
						if (width) {
							$("div.gridScroller", this).width(width + "px");
						}
					});
				}
				$(window).unbind("resizeGrid").bind("resizeGrid", _resizeGrid);
				function tbodyinit(tbody,aStyles){
					var $trs = $datatable.find('tr');// alert($trs.length+$datatable.html());
					$trs
							.hoverClass()
							.each(
									function() {
										var $tr = $(this);
										var $ftds = $(">td", this);
										for ( var i = 0; i < $ftds.size(); i++) {
											var $ftd = $($ftds[i]);
											if (nowrapTD != "false")
												$ftd.html("<div>" + $ftd.html()
														+ "</div>");
											if (i < aStyles.length)
												$ftd.addClass(aStyles[i][1]);
										}
										// $tr.attr("onClick","alert('')");
										$tr
												.click( function() {
													$trs
															.filter(".selected")
															.removeClass("selected");
													$tr.addClass("selected");
													var sTarget = $tr
															.attr("target");
													if (sTarget) {
														if ($("#" + sTarget, $grid)
																.size() == 0) {
															$grid
																	.prepend('<input id="' + sTarget + '" type="hidden" />');
														}
														$("#" + sTarget, $grid)
																.val(
																		$tr
																				.attr("val"));
													}
												});
									});
					ftr = $("tr:first-child", $datatable);
					$(">td", ftr).each( function(i) {
						if (i < aStyles.length)
							$(this).width(aStyles[i][0]);
					});
				}
			});
	};

	$.hxDataGridTool = {
		refresh : function(id){
		    
	    },
		getLeft : function(obj) {
			var width = 0;
			$(obj).prevAll().each( function() {
				width += $(this).outerWidth();
			});
			return width - 1;
		},
		getRight : function(obj) {
			var width = 0;
			$(obj).prevAll().andSelf().each( function() {
				width += $(this).outerWidth();
			});
			return width - 1;
		},
		getTop : function(obj) {
			var height = 0;
			$(obj).parent().prevAll().each( function() {
				height += $(this).outerHeight();
			});
			return height;
		},
		getHeight : function(obj, parent) {
			var height = 0;
			var head = $(obj).parent();
			head.nextAll().andSelf().each( function() {
				height += $(this).outerHeight();
			});
			$(".gridTbody", parent).children().each( function() {
				height += $(this).outerHeight();
			});
			return height;
		},
		getCellNum : function(obj) {
			return $(obj).prevAll().andSelf().size();
		},
		getColspan : function(obj) {
			return $(obj).attr("colspan") || 1;
		},
		getStart : function(obj) {
			var start = 1;
			$(obj).prevAll().each( function() {
				start += parseInt($(this).attr("colspan") || 1);
			});
			return start;
		},
		getPageCoord : function(element) {
			var coord = {
				x :0,
				y :0
			};
			while (element) {
				coord.x += element.offsetLeft;
				coord.y += element.offsetTop;
				element = element.offsetParent;
			}
			return coord;
		},
		getOffset : function(obj, evt) {
			if ($.browser.msie) {
				var objset = $(obj).offset();
				var evtset = {
					offsetX :evt.pageX || evt.screenX,
					offsetY :evt.pageY || evt.screenY
				};
				var offset = {
					offsetX :evtset.offsetX - objset.left,
					offsetY :evtset.offsetY - objset.top
				};
				return offset;
			}
			var target = evt.target;
			if (target.offsetLeft == undefined) {
				target = target.parentNode;
			}
			var pageCoord = $.hxDataGridTool.getPageCoord(target);
			var eventCoord = {
				x :window.pageXOffset + evt.clientX,
				y :window.pageYOffset + evt.clientY
			};
			var offset = {
				offsetX :eventCoord.x - pageCoord.x,
				offsetY :eventCoord.y - pageCoord.y
			};
			return offset;
		}
	};
})(jQuery);

(function($){
	$.fn.extend({
		
		checkboxCtrl: function(parent){
			return this.each(function(){
				var $trigger = $(this);
				$trigger.click(function(){
					var group = $trigger.attr("group");
					
					if ($trigger.is(":checkbox")) {
						var type = $trigger.is(":checked") ? "all" : "none";
						if (group) $.checkbox.select(group, type, parent);
					} else {
						if (group) $.checkbox.select(group, $trigger.attr("selectType") || "all", parent);
					}
					
				});
			});
		}
	});
	
	$.checkbox = {
		selectAll: function(_name, _parent){
			this.select(_name, "all", _parent);
		},
		unSelectAll: function(_name, _parent){
			this.select(_name, "none", _parent);
		},
		selectInvert: function(_name, _parent){
			this.select(_name, "invert", _parent);
		},
		select: function(_name, _type, _parent){
			$parent = $(_parent || document);
			$checkboxLi = $parent.find(":checkbox[name='"+_name+"']");
			switch(_type){
				case "invert":
					$checkboxLi.each(function(){
						$checkbox = $(this);
						$checkbox.attr('checked', !$checkbox.is(":checked"));
					});
					break;
				case "none":
					$checkboxLi.attr('checked', false);
					break;
				default:
					$checkboxLi.attr('checked', true);
					break;
			}
		}
	};
})(jQuery);
(function($){
	$.fn.cssv = function(pre){
		var cssPre = $(this).css(pre);
		return cssPre.substring(0, cssPre.indexOf("px")) * 1;
	};
	$.fn.jBar = function(options){
		var op = $.extend({container:"#container", collapse:".collapse", toggleBut:".toggleCollapse div", sideBar:"#sidebar", sideBar2:"#sidebar_s", splitBar:"#splitBar", splitBar2:"#splitBarProxy"}, options);
		return this.each(function(){
			var jbar = this;
			var sbar = $(op.sideBar2, jbar);
			var bar = $(op.sideBar, jbar);
			$(op.toggleBut, bar).click(function(){
				HX.ui.sbar = false;
				$(op.splitBar).hide();
				var sbarwidth = sbar.cssv("left") + sbar.outerWidth();
				var barleft = sbarwidth - bar.outerWidth();
				var cleft = $(op.container).cssv("left") - (bar.outerWidth() - sbar.outerWidth());
				var cwidth = bar.outerWidth() - sbar.outerWidth() + $(op.container).outerWidth();
				$(op.container).animate({left: cleft,width: cwidth},50,function(){
					bar.animate({left: barleft}, 500, function(){
						bar.hide();
						sbar.show().css("left", -50).animate({left: 5}, 200);
						$(window).trigger("resizeGrid");
					});
				});
				$(op.collapse,sbar).click(function(){
					var sbarwidth = sbar.cssv("left") + sbar.outerWidth();
					if(bar.is(":hidden")) {
						$(op.toggleBut, bar).hide();
						bar.show().animate({left: sbarwidth}, 500);
						$(op.container).click(_hideBar);
					} else {
						bar.animate({left: barleft}, 500, function(){
							bar.hide();
						});
					}
					function _hideBar() {
						$(op.container).unbind("click", _hideBar);
						if (!HX.ui.sbar) {
							bar.animate({left: barleft}, 500, function(){
								bar.hide();
							});
						}
					}
					return false;
				});
				return false;
			});
			$(op.toggleBut, sbar).click(function(){
				HX.ui.sbar = true;
				sbar.animate({left: -25}, 200, function(){				
					bar.show();
				});
				bar.animate({left: 5}, 800, function(){
					$(op.splitBar).show();
					$(op.toggleBut, bar).show();					
					var cleft = 5 + bar.outerWidth() + $(op.splitBar).outerWidth();
					var cwidth = $(op.container).outerWidth() - (cleft - $(op.container).cssv("left"));
					$(op.container).css({left: cleft,width: cwidth});
					$(op.collapse, sbar).unbind('click');
					$(window).trigger("resizeGrid");
				});
				return false;
			});
			$(op.splitBar).mousedown(function(event){
				$(op.splitBar2).each(function(){
					var spbar2 = $(this);
					setTimeout(function(){spbar2.show();}, 100);
					spbar2.css({visibility: "visible",left: $(op.splitBar).css("left")});					
					spbar2.jDrag($.extend(options, {obj:$("#sidebar"), move:"horizontal", event:event,stop: function(){
						$(this).css("visibility", "hidden");
						var move = $(this).cssv("left") - $(op.splitBar).cssv("left");
						var sbarwidth = bar.outerWidth() + move;
						var cleft = $(op.container).cssv("left") + move;
						var cwidth = $(op.container).outerWidth() - move;
						bar.css("width", sbarwidth);
						$(op.splitBar).css("left", $(this).css("left"));
						$(op.container).css({left: cleft,width: cwidth});

					}}));
					return false;					
				});
			});
		});
	}
})(jQuery);