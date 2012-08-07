var hasItem = true; 

this.onTrigger = function() {
	if(hasItem) { 
		if(Game.gold >= 5) {
			var answer = Choise("You have enough gold. you want a portion or a weapon?", "Portion", "Weapon"); 
			GiveItem( anwser ); 
			Say("Goodbye"); 
			hasItem = false; 
		}
		else {
			Say("Come back when you have enough money."); 
		}
	}
	else {
		Say("Have a nice day."); 
	}
}; 
