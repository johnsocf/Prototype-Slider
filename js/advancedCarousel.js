(function($){

	var defaults = {

		waitTime : 800

	};

	function lSAdvancedSlider(element, settings)
	{
		this.options = {};
		this.element = element;
		$.extend(this.options, defaults, settings);

		this.carouselOuter = 
			this.element;

		this.autoSlide = this.options.autoSlide;

		this.carouselInner = 
			$(this.options.carouselInner);				

		this.wrapper = 
			$(this.options.wrapper);
		
		this.leftTransparentElement = 
			$(this.options.leftTransparentElement);
		
		this.rightTransparentElement = 
			$(this.options.rightTransparentElement);

		this.transparentWidth = 
			this.rightTransparentElement.width();

		this.customHeight = 
			this.options.customHeight;

		this.carouselItem = 
			this.options.carouselItem;

		this.singleImageWidth = this.carouselOuter.width() - 
			(this.leftTransparentElement.width() + 
				this.rightTransparentElement.width());

		this.leftLink = $(this.options.leftLink);

		this.rightLink = $(this.options.rightLink);

		this.scrollButtonsContainer = $(this.options.scrollButtonsContainer);

		this.scrollButtonClass = this.options.scrollButtonClass;

		this.init();
	};

	lSAdvancedSlider.prototype.init = function()
	{
		var parent = this,
			totalNumberOfImages = $(parent.carouselItem).length;

			$(parent.carouselItem).width(parent.singleImageWidth);
			parent.wrapper.width(totalNumberOfImages * parent.singleImageWidth);

			parent.carouselInner.height(parent.customHeight).width(parent.singleImageWidth);
			parent.leftTransparentElement.height(parent.customHeight);
			parent.rightTransparentElement.height(parent.customHeight);
			$(parent.carouselItem).height(parent.customHeight);

			$(parent.carouselItem).eq($(parent.carouselItem).length - 1).
				insertBefore($(parent.carouselItem).eq(0));

			var originalWaitTime = parent.waitTime;
			parent.waitTime = 0;
			parent.slideLeft();	
			parent.waitTime = originalWaitTime;

			var linkHeight = parent.leftLink.height();
			var leftLinkContainerHeight = parent.carouselInner.height();

			parent.leftLink.css({"top" : (leftLinkContainerHeight - linkHeight)/2 + "px"}).on("click", function(){
				parent.slideRight.call(parent);
			});

			parent.rightLink.css({"top" : (leftLinkContainerHeight - linkHeight)/2 + "px"}).on("click", function(){
				parent.slideLeft.call(parent);
			});

			$(document).on("keyup", function(e){
				parent.handelDocumentKeyPress(e);
			});

			parent.createSlidingLinks();
			parent.scrollButtonsContainer.find("li").first().addClass("activeLink");

			if(parent.autoSlide == true) {
				parent.setUpAutoScroll();
			}
	}

	lSAdvancedSlider.prototype.slideLeft = function(numberOfSlides)
	{
		var parent = this;

		if(parseInt(parent.wrapper.css("left").replace("px","")) == -(parent.singleImageWidth)) {
			var first = $(parent.carouselItem).first();
			var last = $(parent.carouselItem).last();

			first.insertAfter(last);

			var originalWaitTime = parent.waitTime;
			parent.waitTime = 0;
			parent.wrapper.animate({"left" : "+="+parent.singleImageWidth+"px"}, parent.waitTime);
			parent.waitTime = originalWaitTime;
		}

		var currentActiveLink = parent.scrollButtonsContainer.find(".activeLink");
		var nextActiveLink = currentActiveLink.next();

		nextActiveLink.addClass("activeLink");
		currentActiveLink.removeClass("activeLink");

		if(nextActiveLink.length == 0) {
			nextActiveLink = parent.scrollButtonsContainer.children().first();
			nextActiveLink.addClass("activeLink");
		}

		$(document).off("keyup");
		parent.wrapper.animate({"left" : "-="+parent.singleImageWidth+"px"}, parent.waitTime, function(){

			var originalWaitTime;

			$(document).on("keyup", function(){
				parent.handelDocumentKeyPress(e);
			});

			originalWaitTime = parent.waitTime;
			parent.waitTime = 100;

			if(numberOfSlides > 1) {
				parent.slideLeft(--numberOfSlides);
			}

			parent.waitTime = originalWaitTime;

		});

	}

	lSAdvancedSlider.prototype.slideRight = function(numberOfSlides)
	{
		var parent = this;

		if(parseInt(parent.wrapper.css("left").replace("px","")) == -(parent.singleImageWidth)) {

			var first = $(parent.carouselItem).first();
			var last = $(parent.carouselItem).last();

			last.insertBefore(first);

			var originalWaitTime = parent.waitTime;
			parent.waitTime = 0;
			parent.wrapper.animate({"left": "-="+parent.singleImageWidth+"px"}, parent.waitTime);
			parent.waitTime = originalWaitTime;
		}

		var currentActiveLink = parent.scrollButtonsContainer.find(".activeLink");
		var nextActiveLink = currentActiveLink.prev();

		nextActiveLink.addClass("activeLink");
		currentActiveLink.removeClass("activeLink");

		if(nextActiveLink.length == 0) {
			nextActiveLink = parent.scrollButtonsContainer.children().last();
			nextActiveLink.addClass("activeLink");
		}

		$(document).off("keyup");
		parent.wrapper.animate({"left": "+="+parent.singleImageWidth+"px"}, parent.waitTime, function(){
			var originalWaitTime;

			$(document).on("keyup", function(){
				parent.handelDocumentKeyPress(e);
			});

			originalWaitTime = parent.waitTime;
			parent.waitTime = 100;

			if(numberOfSlides > 1) {
				parent.slideRight(--numberOfSlides);
			}
			parent.waitTime = originalWaitTime;
		});
		
	}

	lSAdvancedSlider.prototype.handelDocumentKeyPress = function (e) {
		var parent = this;
		//left key press proceed
		if(e.keyCode == 37) {
			parent.slideRight();
		}

		//right key press do something else
		if(e.keyCode == 39) {
			parent.slideLeft();
		}
	}

	lSAdvancedSlider.prototype.createSlidingLinks = function() {
		var parent = this;
		$(parent.carouselItem).each(function(index, value){

			var newLink = $("<li>", { class: parent.scrollButtonClass.replace(".","")}).text(index+1);
			
			newLink.on("click", function(){

				parent.autoSlide = false;

				var index, numberOfSlides;
				var currentActiveLink = parent.scrollButtonsContainer.find(".activeLink");
				var indexOfActiveLink = parent.scrollButtonsContainer.find("li").index(currentActiveLink);

				var indexOfClickedLink = parent.scrollButtonsContainer.find("li").index($(this));

				if(indexOfActiveLink < indexOfClickedLink) {
					numberOfSlides = indexOfClickedLink - indexOfActiveLink;

					parent.slideLeft(numberOfSlides);
				}
				else {
					numberOfSlides = indexOfActiveLink - indexOfClickedLink;
					parent.slideRight(numberOfSlides);
				}
			});

			parent.scrollButtonsContainer.append(newLink);
		});
	}

	lSAdvancedSlider.prototype.setUpAutoScroll = function(){
		var parent = this;

		setTimeout(function(){
			parent.slideLeft();
			parent.setUpAutoScroll.call(parent);
		},3000)
	}

	$.fn.advancedCarousel = function(settings){

		var $this = this;
		new lSAdvancedSlider($this, settings);

		return $this;

	};

})(jQuery)