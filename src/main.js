import Phaser from 'phaser'
import './style.css'

class VillageScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor('#3d8b4a')

    for (let x = 20; x < 800; x += 40) {
      for (let y = 20; y < 500; y += 40) {
        this.add.circle(x, y, 2, 0x65b85c)
      }
    }

    this.add.text(20, 20, 'CodeQuest: Bytewood Village', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
    })

    this.instructions = this.add.text(20, 55, 'Use the arrow keys to explore!', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#e8ffe8',
    })

    // Player
    this.player = this.add.rectangle(250, 250, 28, 28, 0xffd166)
    this.player.setStrokeStyle(4, 0x3b2f2f)

    // NPC: Python Sage
    this.sage = this.add.rectangle(590, 250, 32, 40, 0x7b4fb3)
    this.sage.setStrokeStyle(4, 0x34224f)

    this.add.text(550, 285, 'Python Sage', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    })

    // Reward, hidden until the correct answer
    this.reward = this.add.text(20, 95, '★ Syntax Fragment collected!', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffe66d',
    })
    this.reward.setVisible(false)

    // Dialogue box
    this.dialogueBox = this.add.rectangle(400, 400, 740, 180, 0x18232f)
    this.dialogueBox.setStrokeStyle(4, 0xffffff)
    this.dialogueBox.setVisible(false)

    this.dialogueText = this.add.text(55, 325, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
      lineSpacing: 7,
      wordWrap: { width: 680 },
    })
    this.dialogueText.setVisible(false)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )

    this.keys = this.input.keyboard.addKeys({
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
    })

    // 0 = not started, 1 = answering, 2 = completed
    this.questStage = 0
  }

  showDialogue(message) {
    this.dialogueBox.setVisible(true)
    this.dialogueText.setVisible(true)
    this.dialogueText.setText(message)
  }

  isCloseToSage() {
    return (
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.sage.x,
        this.sage.y
      ) < 80
    )
  }

  checkAnswer() {
    if (this.questStage !== 1) return

    if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
      this.questStage = 2
      this.reward.setVisible(true)
      this.showDialogue(
        'Correct! print() displays text or information on the screen.\n\nYou received a Syntax Fragment!'
      )
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.two) ||
      Phaser.Input.Keyboard.JustDown(this.keys.three)
    ) {
      this.showDialogue(
        'Not quite. Try again!\n\nWhat does print() do in Python?\n1. Displays text on the screen\n2. Deletes a variable\n3. Closes the game'
      )
    }
  }

  update() {
    const speed = 4

    if (this.cursors.left.isDown) this.player.x -= speed
    if (this.cursors.right.isDown) this.player.x += speed
    if (this.cursors.up.isDown) this.player.y -= speed
    if (this.cursors.down.isDown) this.player.y += speed

    this.player.x = Phaser.Math.Clamp(this.player.x, 15, 785)
    this.player.y = Phaser.Math.Clamp(this.player.y, 95, 285)

    const closeToSage = this.isCloseToSage()

    if (closeToSage && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (this.questStage === 0) {
        this.questStage = 1
        this.showDialogue(
          'Python Sage: Welcome, Code Keeper!\n\nWhat does print() do in Python?\n1. Displays text on the screen\n2. Deletes a variable\n3. Closes the game'
        )
      } else if (this.questStage === 1) {
        this.showDialogue(
          'What does print() do in Python?\n1. Displays text on the screen\n2. Deletes a variable\n3. Closes the game'
        )
      } else {
        this.showDialogue(
          'Well done, Code Keeper. Take your Syntax Fragment and continue your adventure!'
        )
      }
    }

    this.checkAnswer()

    if (closeToSage && this.questStage === 0) {
      this.instructions.setText('Press Space to talk to the Python Sage')
    } else if (!closeToSage) {
      this.instructions.setText('Use the arrow keys to explore!')
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  parent: 'app',
  pixelArt: true,
  scene: VillageScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
})