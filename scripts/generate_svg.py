from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

console = Console(record=True, width=110)

# Banner
console.print(
    Panel(
        Text(
            "BINANCE FUTURES TESTNET BOT  [*] CONNECTED",
            justify="center",
            style="bold #f0b429",
        ),
        style="bold #f0b429",
    )
)
console.print("")

# Request
table = Table(show_header=False, padding=(0, 2), style="dim white")
table.add_column("Field", style="bold #a2e7ff", min_width=14)
table.add_column("Value", style="bold white")
table.add_row("Symbol", "[bold #00d4ff]BTCUSDT[/]")
table.add_row("Side", "[bold #00ff88]BUY[/]")
table.add_row("Type", "[bold yellow]MARKET[/]")
table.add_row("Quantity", "0.001")

console.print(Panel(table, title="[bold #f0b429]  ORDER REQUEST  [/]", border_style="#f0b429"))
console.print("")

# Response
res_table = Table(show_header=False, padding=(0, 2), style="dim white")
res_table.add_column("Field", style="bold #a2e7ff", min_width=16)
res_table.add_column("Value", style="bold white")
res_table.add_row("Order ID", "3589129")
res_table.add_row("Status", "[bold #00ff88]FILLED[/]")
res_table.add_row("Executed Qty", "0.001")
res_table.add_row("Average Price", "62000.50")

console.print(Panel(res_table, title="[bold #00ff88]  ORDER RESPONSE  [/]", border_style="#00ff88"))

# Success
console.print("\n[bold #00ff88]>> SUCCESS: Order placed successfully[/]\n")

console.save_svg("docs/assets/terminal_execution.svg", title="TradeFlow CLI Execution")
