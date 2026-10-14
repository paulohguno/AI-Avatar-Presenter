# The same excerpt in several voices, to choose by ear: vo/amostras/<n>-<voice>.mp3
import asyncio, pathlib, edge_tts
HERE = pathlib.Path(__file__).parent
TEXT = ("Sua clínica está perdendo dinheiro. Todos os dias. "
        "E se a sua clínica trabalhasse por você, vinte e quatro horas por dia? "
        "Conheça a Clínix. Planos a partir de setenta e nove e noventa por mês, com sete dias grátis pra testar.")
VOICES = [
    ('1', 'pt-BR-AntonioNeural', '+6%', '-2Hz'),   # the current one
    ('2', 'pt-BR-AntonioNeural', '+0%', '+0Hz'),
    ('3', 'en-US-AndrewMultilingualNeural', '+0%', '+0Hz'),
    ('4', 'en-US-BrianMultilingualNeural', '+0%', '+0Hz'),
    ('5', 'pt-BR-ThalitaMultilingualNeural', '+0%', '+0Hz'),
    ('6', 'pt-BR-FranciscaNeural', '+4%', '+0Hz'),
]
async def main():
    for n, v, r, p in VOICES:
        await edge_tts.Communicate(TEXT, v, rate=r, pitch=p).save(str(HERE / f'{n}-{v}.mp3'))
        print(n, v)
asyncio.run(main())
