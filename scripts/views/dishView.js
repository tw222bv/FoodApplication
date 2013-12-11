define(["backbone", "jquery", "underscore", "jade!templates/createDish", "scripts/models/Dish", "scripts/views/ingredientView", "scripts/collection/ingredients"], 
	function(Backbone, $, _, template, Dish, ingrediView, Ingredients){
	return Backbone.View.extend({
		template: template,
		initialize: function() {
			this.dish = new Dish();
			this.ingredients = new Ingredients();
			this.dishIngredients = [];
			//this.dish.ingredients.on("change", this.render(), this);
		},
		render: function(){
			var title = this.$el.find("#title").val();
			if(!this.ingredients == "undefined")
			{
				this.ingredients.fetch({
					success: function(){
						this.dishIngredients = this.ingredients.where({ dishTitle: title})
					}
				});
			}
			console.log(this.dishIngredients);
			this.$el.empty();
			this.$el.append(template({ingredients: this.dishIngredients.models, title: title}));
			this.$el.find("#addIngredient").focus();
			return this;
		},
		events: {
			"keypress #addIngredient"	: "createOnEnter",
			"click .btn"				: "finishRecipe"
		},
		createOnEnter: function(e){
			if(e.keyCode != 13) return;
			if(!this.$("#addIngredient").val()) return;
			console.log("Value of ingredient just added: " + $("#addIngredient").val());
			this.addIngredient($("#addIngredient").val());
			this.$("#addIngredient").val('');
			this.render();
		},
		addingredient: function(value){
			this.dishIngredients[dishIngredients.length] = value;
		},
		finishRecipe: function(){
			if(!this.$("#title").val().trim()){
				console.log("Can't have a recipe without a title!");
				return;
			}
			
			for(var i = 0; i < this.collection.models.length; i++)
			{
				if(this.collection.models[i].get('title') == this.$("#title").val().trim())
				{
					console.log("exists!");
					return;
				}
			}
			this.dish.set({"title": this.$("#title").val().trim()});

			for(var i = 0; i < this.dishIngredients.length; i++)
			{
				this.ingredients.create(new Ingredient(name:this.dishIngredients[i], dishTitle:this.dish.get('title')))
			}
			
			if(this.dish.isValid())
			{
				this.collection.create(this.dish);
				console.log("Item is added to collection");
				document.location.href = window.location.toString().split("#")[0];
			}
			else if(!this.dish.isValid())
			{
				console.log(this.dish.validationError);
			}
		}
	});
});