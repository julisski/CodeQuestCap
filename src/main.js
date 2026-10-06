import Phaser from 'phaser'
import './style.css'

class VillageScene extends Phaser.Scene {
  constructor() {
    super('VillageScene')
  }
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
    // Locked path to the next area
    this.gate = this.add.rectangle(720, 245, 22, 180, 0x8b2b2b)
    this.gate.setStrokeStyle(4, 0x4a1717)

    this.gateLabel = this.add.text(665, 350, 'Locked path', {
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
    this.gate.setFillStyle(0x5cce7f)
    this.gateLabel.setText('Path open!')

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
    if (this.questStage < 2 && this.player.x > 685) {
      this.player.x = 685
    }
    if (this.questStage === 2 && this.player.x > 770) {
    this.scene.start('PythonPeaksScene')
  }

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
class PythonPeaksScene extends Phaser.Scene {
  constructor() {
    super('PythonPeaksScene')
  }
  

  create() {
    this.cameras.main.setBackgroundColor('#67a9d8')

    // Mountain background
    this.add.triangle(180, 340, 30, 450, 180, 120, 330, 450, 0x4f6c8b)
    this.add.triangle(480, 340, 300, 450, 480, 90, 660, 450, 0x3b5875)
    this.add.triangle(700, 360, 570, 450, 700, 170, 830, 450, 0x4f6c8b)

    this.add.text(20, 20, 'CodeQuest: Python Peaks', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
    })

    this.instructions = this.add.text(20, 55, 'Explore the mountain path!', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#e8f7ff',
    })

    this.player = this.add.rectangle(80, 250, 28, 28, 0xffd166)
    this.player.setStrokeStyle(4, 0x3b2f2f)

    // Loop Guardian NPC
    this.guardian = this.add.rectangle(590, 250, 34, 42, 0x4b6cb7)
    this.guardian.setStrokeStyle(4, 0x1f315c)

    this.add.text(535, 290, 'Loop Guardian', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    })

    this.reward = this.add.text(20, 95, '★ Loop Rune collected!', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffe66d',
    })
    this.reward.setVisible(false)

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

    this.questStage = 0
  }

  showDialogue(message) {
    this.dialogueBox.setVisible(true)
    this.dialogueText.setVisible(true)
    this.dialogueText.setText(message)
  }

  isCloseToGuardian() {
    return (
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.guardian.x,
        this.guardian.y
      ) < 80
    )
  }

  checkAnswer() {
    if (this.questStage !== 1) return

    if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
      this.questStage = 2
      this.reward.setVisible(true)
      this.showDialogue(
        'Correct! A for loop is useful when you know how many times code should repeat.\n\nYou received a Loop Rune!'
      )
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.two) ||
      Phaser.Input.Keyboard.JustDown(this.keys.three)
    ) {
      this.showDialogue(
        'Not quite. Try again!\n\nWhich tool repeats code a known number of times?\n1. A for loop\n2. print()\n3. A string'
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

    const closeToGuardian = this.isCloseToGuardian()

    if (closeToGuardian && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (this.questStage === 0) {
        this.questStage = 1
        this.showDialogue(
          'Loop Guardian: A strong programmer knows how to repeat tasks.\n\nWhich tool repeats code a known number of times?\n1. A for loop\n2. print()\n3. A string'
        )
      } else if (this.questStage === 1) {
        this.showDialogue(
          'Which tool repeats code a known number of times?\n1. A for loop\n2. print()\n3. A string'
        )
      } else {
        this.showDialogue(
          'You understand loops, Code Keeper. The mountain path is safer because of your knowledge!'
        )
      }
    }

    this.checkAnswer()

    if (closeToGuardian && this.questStage === 0) {
      this.instructions.setText('Press Space to talk to the Loop Guardian')
    } else if (!closeToGuardian) {
      this.instructions.setText('Explore the mountain path!')

      

    }
  }
}
new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  parent: 'app',
  pixelArt: true,
  scene: [VillageScene, PythonPeaksScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
})