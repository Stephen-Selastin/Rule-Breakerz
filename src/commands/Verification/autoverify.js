export { default } from './modules/autoVerify.js';
pip install discord.py
import discord
from discord.ext import commands
from discord import app_commands

intents = discord.Intents.default()
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

verify_role_id = None  # store role ID

# Button UI
class VerifyButton(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="✅ Verify", style=discord.ButtonStyle.green)
    async def verify(self, interaction: discord.Interaction, button: discord.ui.Button):
        global verify_role_id

        if verify_role_id is None:
            await interaction.response.send_message("❌ Verify role not set!", ephemeral=True)
            return

        role = interaction.guild.get_role(verify_role_id)

        if role in interaction.user.roles:
            await interaction.response.send_message("⚠️ You are already verified!", ephemeral=True)
            return

        await interaction.user.add_roles(role)
        await interaction.response.send_message("✅ You are now verified!", ephemeral=True)


@bot.event
async def on_ready():
    bot.add_view(VerifyButton())  # persistent button
    await bot.tree.sync()
    print(f"Logged in as {bot.user}")


# Slash command to set verify role
@bot.tree.command(name="setverifyrole", description="Set verify role")
@app_commands.describe(role="Select verify role")
async def setverifyrole(interaction: discord.Interaction, role: discord.Role):
    global verify_role_id
    verify_role_id = role.id
    await interaction.response.send_message(f"✅ Verify role set to {role.mention}")


# Slash command to send verify panel
@bot.tree.command(name="verifypanel", description="Send verification panel")
async def verifypanel(interaction: discord.Interaction):
    embed = discord.Embed(
        title="🔒 Server Verification",
        description="Click the button below to verify yourself and access the server.",
        color=discord.Color.green()
    )
    await interaction.channel.send(embed=embed, view=VerifyButton())
    await interaction.response.send_message("✅ Verification panel sent!", ephemeral=True)


# Run bot
bot.run("MTQ5MTYzMTk1NzI3OTI0ODQxNA.GlzVKe.hTrZ7sWcztOP6K0sb1JKjW_s2qM9WK1kqM2IBE")
ll
