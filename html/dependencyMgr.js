const module = (function () { // eslint-disable-line no-unused-vars
  function register (name, initFn, dependencies = []) {
    register.queuedModuleList = register.queuedModuleList || {}
    register.loadedModuleList = register.loadedModuleList || []
    const filterFn = n => !register.loadedModuleList.includes(n)
    const resolveDependencies = () => {
      for (const name in register.queuedModuleList) {
        const queuedModule = register.queuedModuleList[name]
        queuedModule.dependencies = queuedModule.dependencies.filter(filterFn)
        if (!queuedModule.dependencies.length) {
          queuedModule.initFn()
          register.loadedModuleList.push(name)
          delete register.queuedModuleList[name]
          resolveDependencies()
        }
      }
    }
    const traverseDependencyList = (name, dependencies, list = [name]) => {
      if (dependencies.includes(name)) {
        list.push(name)
        throw new TypeError(`Provided module results in a circular dependency: ${list.join('->')}.`)
      }
      dependencies
        .filter(dependency => Object.prototype.hasOwnProperty.call(register.queuedModuleList, dependency))
        .forEach(dependency => {
          traverseDependencyList(name, register.queuedModuleList[dependency].dependencies, [...list, dependency])
        })
    }
    const checkCircularDependencies = () => {
      for (const name in register.queuedModuleList) {
        const queuedModule = register.queuedModuleList[name]
        traverseDependencyList(name, queuedModule.dependencies)
      }
    }

    register.queuedModuleList[name] = { initFn, dependencies }
    try {
      checkCircularDependencies()
    } catch (err) {
      delete register.queuedModuleList[name]
      throw err
    }
    resolveDependencies()
  }

  function load (arr = [], nested = ['.']) {
    arr.forEach(el => {
      if (typeof el === 'string') {
        const script = document.createElement('script')
        script.src = `${[...nested, el].join('/')}.js`
        document.head.appendChild(script)
      } else {
        for (const name in el) {
          el[name].push(name)
          load(el[name], [...nested, name])
        }
      }
    })
  }

  return { load, register }
})()
