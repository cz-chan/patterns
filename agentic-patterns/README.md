# Patrones de Diseño Agéntico

## Aprendiendo sobre patrones de diseño para agentes

Este es el repositorio del proyecto para aprender sobre patrones de diseño para agentes.

### Tecnologías

- TypeScript
- [Bun](https://bun.sh)
- [AI SDK](https://www.npmjs.com/package/ai)
- [Zod](https://www.npmjs.com/package/zod)

Este paquete forma parte de un monorepo con [Bun workspaces](https://bun.sh/docs/install/workspaces). Las dependencias se instalan desde la raíz del repositorio y comparten un único `bun.lock`.

### Levantar proyecto

1. Clonar el `.env.template` y renombrarlo a `.env`
2. Llenar las variables de entorno
3. Instalar las dependencias desde la raíz del monorepo `bun install`
4. Ejecutar el proyecto `bun run dev` (o desde la raíz: `bun --filter agentic-patterns dev`)
5. Cambiar el `main.ts` para ejecutar el patrón que se desee

Bun ejecuta TypeScript directamente, no hace falta compilar. Para recargar al guardar cambios usa `bun run watch`.

## Actualizar dependencias (Opcional)

Ejecuta estos comandos dentro de la carpeta `agentic-patterns` para que afecten solo a este paquete.

Para actualizar todas las dependencias a las últimas versiones permitidas por package.json, ejecuta:

```bash
bun update
```

Si quieres actualizar una dependencia específica a la última versión (mayor, menor, o patch), usa:

```bash
bun add nombre-del-paquete@latest
```

Para revisar si hay actualizaciones disponibles:

```bash
bun outdated
```

**Nota:** Si quieres actualizar todas las dependencias a la última versión disponible (rompiendo potencialmente cambios mayores), usa:

```bash
bun update --latest
```

Esto modificará tu `package.json` con las versiones más recientes.

# patterns
